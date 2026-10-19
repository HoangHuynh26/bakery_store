# Maison Douce Bakery — Implementation Progress & Changelog

## Project Status Overview
- **Project Name:** MAISON DOUCE BAKERY — Crafted with Love, Baked with Passion
- **Architecture:** Monorepo (React + Vite SPA Frontend, Java 21 Spring Boot Monolith Backend, PostgreSQL Database)
- **Current Active Branch:** `feature/project-foundation`

---

## Phase Breakdown & Feature Tracking

### Phase 1 — Project Foundation
- [x] **Feature 1.1**: Monorepo Initialization, Docker Compose, CI Workflow, Environment Config & Documentation
- [x] **Feature 1.2**: Spring Boot Backend Foundation (Flyway migrations V1 & V2, JPA Entities, Security Config, OpenAPI, Actuator, Global Exceptions)
- [x] **Feature 1.3**: React Frontend Foundation (Design tokens, Tailwind, React Router, Query Provider, Zustand, Layout Shell)

### Phase 2 — Storefront & Catalog
- [x] **Feature 2.1**: Editorial Homepage with 15 Brand & Merchandising Sections
- [x] **Feature 2.2**: Category & Product Catalog Browsing with Vietnamese/English names
- [x] **Feature 2.3**: Product Detail Page (Variants, Flavors, Sizes, Allergens, Ingredients, Lead Times)
- [x] **Feature 2.4**: Live Search with Debounce, Instant Suggestions & Dedicated Search Results Page
- [x] **Feature 2.5**: Catalog Filters (Price range, Diet, Flavor, Availability) & Sorting

### Phase 3 — Identity & Shopping
- [x] **Feature 3.1**: Customer Registration, Login, JWT Access & Rotating Refresh Tokens
- [x] **Feature 3.2**: Customer Profile, Address Book & Notification Preferences
- [x] **Feature 3.3**: Customer Wishlist & Recently Viewed Products
- [x] **Feature 3.4**: Persistent Shopping Cart (Cart Drawer, Full Cart Page, Guest Cart Merging)

### Phase 4 — Checkout & Fulfillment
- [x] **Feature 4.1**: Multi-Step Checkout Workflow (Customer info, Delivery/Pickup, Slot capacity, Payment selection)
- [x] **Feature 4.2**: Server-side Order Calculation & Payment Integration (COD, Store Pickup, Manual Bank Transfer with VietQR)
- [x] **Feature 4.3**: Stock Reservation, Concurrency Protection & Transactional Order State Machine
- [x] **Feature 4.4**: Order Confirmation, Receipt Summary, Order Tracking Timeline & Customer Order History

### Phase 5 — Admin Operations
- [ ] **Feature 5.1**: Admin RBAC & Authentication (SUPER_ADMIN, ADMIN, STAFF)
- [ ] **Feature 5.2**: Operational Dashboard (Today's sales, pending orders, revenue, low stock alerts)
- [ ] **Feature 5.3**: Product & Category Management (CRUD, Variants, Allergens, Image management)
- [ ] **Feature 5.4**: Order Management & Audit Trail (Status updates, packing lists, kitchen tickets, staff assignment)
- [ ] **Feature 5.5**: Customer & Delivery Zone Management

### Phase 6 — Advanced Bakery Operations
- [ ] **Feature 6.1**: Custom Celebration Cake Builder (Shape, size, flavor, filling, frosting, message, reference photo)
- [ ] **Feature 6.2**: Custom Cake Quotation Review Workflow (Admin quotation, customer accept/reject)
- [ ] **Feature 6.3**: Bakery Production Board (Kitchen tablet view: Baking queue, Decorating queue, Ready queue)
- [ ] **Feature 6.4**: Ingredient Inventory Tracking & Low Stock Alerts

### Phase 7 — Customer Retention
- [ ] **Feature 7.1**: Product Reviews & Ratings with Verified Purchase Badges
- [ ] **Feature 7.2**: Promotion Engine & Coupon Codes (Fixed, percentage, min spend, per-user limits)
- [ ] **Feature 7.3**: Loyalty Rewards & Membership Tiers
- [ ] **Feature 7.4**: Customer Support Inquiries & Interactive Rule-Based FAQ Chatbot
- [ ] **Feature 7.5**: Operational Notification Center & Transactional Email Notifications

### Phase 8 — Reporting & Production Readiness
- [ ] **Feature 8.1**: Business Analytics & Financial CSV Export
- [ ] **Feature 8.2**: SEO Structured Data (Schema.org Breadcrumb & Product), Sitemap & Open Graph
- [ ] **Feature 8.3**: End-to-End User Journeys & Automated Verification
- [ ] **Feature 8.4**: Production Deployment Guides & Release Tagging

---

## Commit & Push Log

| Feature | Branch | Commit Hash | Automated Tests | Push Result | Status |
|---------|--------|-------------|-----------------|-------------|--------|
| Feature 1: Project Foundation & Architecture Setup | `feature/project-foundation` | `8ab61d0` | 4/4 Spring Boot tests, Vite build | Pushed to origin | Completed |
| Feature 2: Storefront & Product Catalog (Browsing, Search, Filters, Detail) | `feature/catalog-storefront` | `d3f4726` | 11/11 Spring Boot tests, Vite build | Pushed to origin | Completed |
| Feature 3: Identity & Shopping (Auth, Tokens, Address Book, Wishlist, Persistent Cart) | `feature/identity-and-cart` | `68790c9` | 24/24 Spring Boot tests, Vite build | Pushed to origin | Completed |
