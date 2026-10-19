# Maison Douce Bakery — Feature Matrix & Requirements Traceability

| Category | Feature Name | Description | Key Components |
|---|---|---|---|
| **Branding & UI** | French Boutique Aesthetics | Warm ivory, caramel gold, espresso brown luxury styling; editorial serif headings. | Tailwind tokens, CSS Modules, Lucide icons |
| **Catalog** | 16 Bakery Categories | Cakes, Pastries, Tiramisu, Choux, Macarons, Beverages in EN & VI. | `categories`, `products`, `product_variants` |
| **Catalog** | Product Customization | Choice of size, serving count, flavor, sweetness level, candles. | `product_customization_groups`, `options` |
| **Search & Discovery** | Instant Search & Filter | Debounced search with auto-suggest, price slider, diet filters. | Live filter components, JPA Specifications |
| **Identity** | Customer Accounts & RBAC | JWT access + rotating refresh tokens; address book; order history. | `users`, `refresh_tokens`, `customer_addresses` |
| **Cart** | Persistent Shopping Cart | Cart drawer + full page, guest cart persistence, auto merge upon login. | Zustand store, `shopping_carts`, `cart_items` |
| **Custom Cake** | 3D / Step Cake Builder | Custom shape, frosting, color theme, piping message, photo upload. | `custom_cake_requests`, Admin quotation flow |
| **Checkout** | Multi-Step Checkout | Delivery vs Store Pickup, time-slot capacity reservation, COD & QR transfer. | `orders`, `order_items`, `payments` |
| **Order Tracking** | Live Fulfillment Timeline | Visual progress through Confirmed, Baking, Decorating, Delivery. | `order_status_history`, timeline component |
| **Admin Operations**| Operational Dashboard | Real-time KPIs: Revenue, order volume, best-sellers, low-stock warnings. | Recharts, Admin Controller, JPA Aggregations |
| **Admin Operations**| Kitchen Preparation Board | Tablet-friendly kanban view for bakery chefs and decorators. | Drag/click status workflow, real-time lists |
| **Inventory** | Recipe & Raw Ingredients | BOM tracking, automatic stock deduction, low threshold alerts. | `ingredients`, `product_recipes`, `stock_movements` |
| **Retention** | Loyalty & Points System | Tiered membership (Bronze, Silver, Gold), points redemption on checkout. | `loyalty_accounts`, `loyalty_transactions` |
| **Retention** | Promotion Engine | Percentage/fixed coupons, minimum spending, per-customer limits. | `coupons`, `coupon_redemptions` |
| **Support** | Help Center & FAQ Chatbot | Interactive rule-based concierge for bakery hours, allergens & delivery. | Knowledge base parser, inquiry tickets |
