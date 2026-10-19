# Maison Douce Bakery — Architecture Document

## 1. System Overview

Maison Douce Bakery is built as a production-grade, highly cohesive modular monolith:
- **Frontend:** Single Page Application (SPA) built with React 18, Vite, React Router v6, TanStack Query v5, Zustand, and Tailwind CSS.
- **Backend:** Spring Boot 3.3.x on Java 21 LTS with Spring Web MVC, Spring Security 6, Spring Data JPA, Hibernate, Flyway, and Actuator.
- **Database:** PostgreSQL 16 (or Neon PostgreSQL in cloud environments) with Flyway migrations.
- **Infrastructure:** Docker Compose, GitHub Actions CI/CD.

```
+-------------------------------------------------------+
|               React 18 SPA (Vite)                     |
|  - TanStack Query (Server State Cache)                |
|  - Zustand (Client UI State: Cart, Auth, Drawer)      |
|  - Native Fetch API Client (Services layer)           |
+---------------------------+---------------------------+
                            | REST JSON APIs (/api/v1)
                            v
+-------------------------------------------------------+
|             Spring Boot 3.3 (Java 21 LTS)             |
|  - Spring Security (JWT Token Filter, RBAC)           |
|  - Modular Monolith Domains:                          |
|    * auth / user / catalog / inventory / cart / order |
|    * payment / delivery / promotion / review / etc.   |
|  - Centralized Exception Handler & ApiResponse DTO    |
+---------------------------+---------------------------+
                            | JDBC / Hibernate (JPA)
                            v
+-------------------------------------------------------+
|             PostgreSQL 16 (Relational DB)             |
|  - Flyway Migrations (Schema & Seed Data)             |
|  - ACID Transactions, Constraints, Indexes            |
|  - UUID Keys, Numeric Currency (VND), UTC Timestamps  |
+-------------------------------------------------------+
```

## 2. Monorepo Organization

```
maison-douce-bakery/
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Modular, design-token aligned UI
│   │   ├── pages/        # Route page views (public, auth, customer, admin)
│   │   ├── services/     # Native Fetch API clients
│   │   ├── store/        # Zustand global state (cart, auth, ui)
│   │   ├── hooks/        # Reusable React hooks
│   │   └── styles/       # CSS tokens & Tailwind
├── backend/              # Spring Boot REST API
│   ├── src/main/java/com/maisondouce/bakery/
│   │   ├── config/       # Web, Security, Swagger, CORS
│   │   ├── security/     # JWT provider, filters, principal
│   │   ├── common/       # DTOs, BaseEntity, Exception handling
│   │   └── modules/      # Feature modules (Domain driven)
│   └── src/main/resources/
│       ├── db/migration/ # Flyway SQL migrations
│       └── application.yml
├── docs/                 # Engineering documentation
└── docker-compose.yml    # Local multi-service orchestration
```

## 3. Communication Patterns & Data Flow

1. **Client Request:** Component invokes TanStack Query hook -> calls `services/*ApiClient.js` using native `fetch()`.
2. **Security Gateway:** Spring Security `JwtAuthenticationFilter` intercepts request, extracts Bearer token, validates signature/expiration, and loads `UserPrincipal` into SecurityContext.
3. **Controller:** Validates `@Valid` request DTO and forwards to Service.
4. **Service:** Executes business logic inside `@Transactional` boundaries, applies invariants, updates entity models, and logs audit events.
5. **Persistence:** Spring Data JPA executes queries against PostgreSQL; schema managed via Flyway.
6. **Response:** Sanitized DTO wrapped inside `ApiResponse<T>` returned with appropriate HTTP status code.
