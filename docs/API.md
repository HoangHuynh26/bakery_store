# Maison Douce Bakery — REST API Documentation

Base URI: `/api/v1`
Interactive Swagger / OpenAPI UI: `http://localhost:8080/swagger-ui.html`
OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

## 1. Standard Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2026-10-19T04:00:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items retrieved",
  "data": [ ... ],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "isLast": false
  },
  "timestamp": "2026-10-19T04:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "errorCode": "RESOURCE_NOT_FOUND",
  "message": "Product with ID not found",
  "errors": [
    { "field": "productId", "message": "Product does not exist" }
  ],
  "timestamp": "2026-10-19T04:00:00Z"
}
```

## 2. Core API Endpoints

### Authentication (`/auth`)
- `POST /api/v1/auth/register` — Register a new customer
- `POST /api/v1/auth/login` — Authenticate and receive JWT access & refresh tokens
- `POST /api/v1/auth/refresh` — Rotate refresh token and acquire new access token
- `POST /api/v1/auth/logout` — Invalidate refresh token session
- `GET  /api/v1/auth/me` — Retrieve authenticated user profile

### Catalog (`/catalog`, `/products`, `/categories`)
- `GET  /api/v1/categories` — List all active bakery categories
- `GET  /api/v1/products` — Filtered, paginated product list (category, min/max price, flavor, sort)
- `GET  /api/v1/products/{idOrSlug}` — Detailed product view with variants, allergens & ingredients
- `GET  /api/v1/products/featured` — Featured signature pastries & best sellers
- `GET  /api/v1/products/search` — Debounced search suggestions and matching products

### Cart & Wishlist (`/cart`, `/wishlist`)
- `GET  /api/v1/cart` — Get current user or guest cart
- `POST /api/v1/cart/items` — Add product variant with customizations
- `PUT  /api/v1/cart/items/{itemId}` — Update quantity
- `DELETE /api/v1/cart/items/{itemId}` — Remove item
- `POST /api/v1/cart/merge` — Merge guest cart into user account upon login
- `GET  /api/v1/wishlist` — Get user wishlist items
- `POST /api/v1/wishlist/{productId}` — Toggle wishlist item

### Checkout & Orders (`/checkout`, `/orders`)
- `POST /api/v1/checkout/calculate` — Recalculate totals, delivery fees, and discount eligibility
- `POST /api/v1/checkout/place-order` — Create and commit order with stock validation
- `GET  /api/v1/orders/my-orders` — Customer order history
- `GET  /api/v1/orders/{orderNumber}` — Order details and live preparation tracking timeline
- `POST /api/v1/orders/{orderNumber}/cancel` — Customer cancellation request (policy-gated)

### Custom Cake Builder (`/custom-cakes`)
- `POST /api/v1/custom-cakes` — Submit custom cake requirements & photo reference
- `GET  /api/v1/custom-cakes/my-requests` — Customer custom cake requests
- `POST /api/v1/custom-cakes/{id}/accept-quotation` — Accept admin custom quotation

### Operations & Admin (`/admin/*`)
- `GET  /api/v1/admin/dashboard/summary` — High-level KPI metrics & alerts
- `GET  /api/v1/admin/products` — Full product inventory management
- `POST /api/v1/admin/products` — Create new product
- `PUT  /api/v1/admin/products/{id}` — Update product & variants
- `GET  /api/v1/admin/orders` — Orders management with status filters
- `PUT  /api/v1/admin/orders/{id}/status` — Authorized order state transitions
- `GET  /api/v1/admin/production/board` — Kitchen tablet preparation board
- `GET  /api/v1/admin/analytics/revenue` — Revenue report and CSV export
