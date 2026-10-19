# Maison Douce Bakery — Deployment Guide

## 1. Local Development Deployment

### Prerequisites
- Java 21 LTS (`java -version`)
- Maven 3.9+ (`mvn -v`)
- Node.js 20+ (`node -v`)
- Docker & Docker Compose (`docker-compose -v`)

### Quickstart with Docker Compose
```bash
# 1. Clone repository and navigate to root
cd bakery_store

# 2. Copy environment template
cp .env.example .env

# 3. Spin up full stack (PostgreSQL + Backend + Frontend)
docker-compose up --build
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### Running Services Independently

#### PostgreSQL
```bash
docker-compose up -d postgres
```

#### Backend (Spring Boot)
```bash
cd backend
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```

#### Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 2. Production Cloud Deployment

### Database: Neon PostgreSQL
1. Create a project at [Neon.tech](https://neon.tech).
2. Copy the pooled connection string into `DATABASE_URL`.
3. Set `spring.datasource.url` with `sslmode=require`. Flyway will automatically execute migrations on startup.

### Backend: Render / VPS / AWS
1. Build the multi-stage Docker image defined in `backend/Dockerfile`.
2. Provide production environment variables (`DATABASE_URL`, `JWT_SECRET`, `CORS_ALLOWED_ORIGINS`).
3. Set `SPRING_PROFILES_ACTIVE=prod`.

### Frontend: Vercel / Netlify
1. Connect Git repository to Vercel.
2. Root Directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_BASE_URL=https://api.yourdomain.com/api/v1`
6. Include single page application rewrite (`vercel.json`).
