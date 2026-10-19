# Maison Douce Bakery — Relational Database Specification

## 1. Design Principles
- **RDBMS Engine:** PostgreSQL 16+ (Compatible with Neon Serverless Postgres).
- **Primary Keys:** UUID v4 generation (`gen_random_uuid()` or JPA UUID generator) for security and cross-system identity preservation.
- **Monetary Units:** `NUMERIC(15, 2)` for Vietnamese Dong (VND) and exact financial precision. Floating point values are strictly forbidden.
- **Temporal Data:** `TIMESTAMP WITH TIME ZONE` stored in UTC; formatted for presentation in `Asia/Ho_Chi_Minh`.
- **Migration Strategy:** Versioned, immutable Flyway migrations under `src/main/resources/db/migration/`.

## 2. Entity Relational Model & Domains

### A. Identity & Access
- `users`: User identity (id, email, password_hash, full_name, phone_number, avatar_url, status, email_verified, created_at, updated_at).
- `roles`: Role definitions (`ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`).
- `user_roles`: Many-to-many junction between `users` and `roles`.
- `refresh_tokens`: Rotating refresh tokens (id, user_id, token_hash, expires_at, revoked, replaced_by_token, created_at).
- `customer_addresses`: Saved delivery addresses (id, user_id, recipient_name, phone, street, ward, district, city, is_default, note).

### B. Catalog & Products
- `categories`: Product categories (id, slug, name_en, name_vi, description, display_order, image_url, is_active).
- `products`: Base bakery products (id, category_id, sku, slug, name_en, name_vi, description, base_price, promotional_price, lead_time_hours, shelf_life_days, storage_instructions, is_featured, is_active, stock_quantity).
- `product_variants`: Size, weight, and flavor combinations (id, product_id, sku, name_en, name_vi, price_adjustment, stock_quantity, is_active).
- `product_images`: Multiple product gallery images (id, product_id, image_url, alt_text, display_order, is_thumbnail).
- `allergens`: Allergen registry (id, code, name_en, name_vi, icon).
- `product_allergens`: Junction between `products` and `allergens`.
- `product_customization_groups`: Configurable options for cakes (id, product_id, name, min_selection, max_selection).
- `product_customization_options`: Values (id, group_id, name, price_adjustment).

### C. Cart & Orders
- `shopping_carts`: Active user or session carts (id, user_id, session_token, created_at, updated_at).
- `cart_items`: Cart items (id, cart_id, product_id, variant_id, quantity, customization_snapshot, unit_price).
- `orders`: Master order records (id, order_number, user_id, status, payment_status, fulfillment_type, subtotal, discount_amount, delivery_fee, total_amount, recipient_name, recipient_phone, delivery_address, delivery_date, time_slot, customer_notes, admin_notes, created_at, updated_at).
- `order_items`: Purchased line items snapshot (id, order_id, product_id, variant_id, product_name, variant_name, quantity, unit_price, total_price, customization_snapshot).
- `order_status_history`: Auditable state transitions (id, order_id, previous_status, new_status, changed_by_user_id, note, created_at).
- `custom_cake_requests`: Dedicated celebration cake requests (id, user_id, cake_type, shape, size_servings, flavor, filling, frosting, color_theme, message, reference_image_url, budget_estimate, status, preferred_date, quotation_price).

### D. Payments & Logistics
- `payments`: Payment records (id, order_id, payment_method, amount, currency, transaction_reference, status, paid_at).
- `delivery_zones`: Configured delivery boundaries and standard fees (id, name, districts, base_fee, min_free_delivery_threshold).
- `delivery_time_slots`: Capacity-controlled time slots (id, slot_name, start_time, end_time, max_orders_per_slot).

### E. Inventory & Kitchen
- `ingredients`: Raw materials (id, code, name, unit, current_stock, minimum_threshold, cost_per_unit).
- `stock_movements`: Stock audit log (id, ingredient_id, product_id, movement_type, quantity, reason, reference_id, created_at).
- `product_recipes`: Production BOM (id, product_id, variant_id, ingredient_id, quantity_required).

### F. Marketing & Retention
- `coupons`: Promotion codes (id, code, description, discount_type, discount_value, min_spend, max_discount, usage_limit, per_user_limit, used_count, start_date, end_date, is_active).
- `coupon_redemptions`: Audit of coupon usage (id, coupon_id, user_id, order_id, redeemed_at).
- `loyalty_accounts`: Reward points ledger (id, user_id, points_balance, lifetime_points, tier).
- `loyalty_transactions`: History of point earnings and redemptions.
- `product_reviews`: Verified reviews (id, product_id, user_id, order_id, rating, comment, is_verified_purchase, status, created_at).
- `support_tickets`: Customer assistance requests (id, user_id, order_id, subject, status, priority, created_at).

## 3. Indexes & Constraints
- Unique indexes on `users(email)`, `products(sku)`, `products(slug)`, `categories(slug)`, `coupons(code)`.
- Foreign key indexes on all child tables (`order_id`, `product_id`, `user_id`, `cart_id`).
- Compound index on `orders(user_id, created_at DESC)` and `orders(status, delivery_date)`.
