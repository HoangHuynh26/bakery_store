# Maison Douce Bakery — Security & Business Integrity

## 1. Authentication & Token Architecture
- **JWT Access Tokens:** Short-lived (15 minutes), signed with HMAC-SHA256 (256-bit+ secure key). Claims contain user ID, email, and role authorities.
- **Refresh Tokens:** Long-lived (7 days), stored in the database as SHA-256 hashes with automatic rotation. When a refresh token is used, it is revoked and replaced. If a revoked token is replayed, all descendant tokens are invalidated to protect against token hijacking.
- **Password Hashing:** BCrypt with a configurable work factor (default 12), ensuring resistance to brute force attacks.

## 2. Authorization & RBAC
- Role-based security enforced via Spring Security `@PreAuthorize` and `SecurityFilterChain`:
  - `ROLE_SUPER_ADMIN`: Full administrative control, system settings, staff management.
  - `ROLE_ADMIN`: Store management, catalog, orders, promotions, production.
  - `ROLE_STAFF`: Order fulfillment, kitchen queue, inventory tracking.
  - `ROLE_CUSTOMER`: Personal profile, cart, checkout, order history.

## 3. Order & Inventory Integrity
- **Double Checkout Prevention:** Idempotent checkout keys and database-level transactional locks (`@Transactional(isolation = Isolation.REPEATABLE_READ)`) preventing concurrent double-order creation.
- **Race Condition Protection on Stock:** Atomic database updates ensuring `stock_quantity >= quantity` before decrementing.
- **Server-Side Price Authority:** Frontend-submitted prices or discounts are never trusted. All totals, variant price adjustments, and coupon redemptions are recalculated on the backend.
- **State Machine Integrity:** Strict validation of order status transitions (e.g., an order cannot jump from `PENDING_PAYMENT` to `COMPLETED` without reaching fulfillment stages).

## 4. Web Application Security
- **CORS:** Explicit origin allowlisting (e.g., `http://localhost:5173`).
- **CSRF & Injection:** State-changing operations protected via Bearer authentication; all SQL executed through parameterized JPA queries; input validated through Bean Validation (`@Valid`).
- **Rate Limiting:** Protects sensitive endpoints (login, register, forgot-password) against credential stuffing and brute-force attempts.
