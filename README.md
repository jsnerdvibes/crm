# Multi-Tenant SaaS CRM Backend

A production-ready, multi-tenant SaaS backend for a CRM application built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** targeting **MySQL/MariaDB**.

This project implements clean architecture patterns using SOLID principles, centralized security/tenant isolation, and a robust test suite covering unit, integration, and E2E flows.

---

## 🚀 Key Features

* **Multi-Tenancy Support**:
  * **Schema Isolation**: Dedicated database schema per tenant.
  * **Field Isolation**: Automated tenant scoping using centralized repositories.
* **Clean Architecture**:
  * Generic [BaseRepository](file:///c:/Danish/Projects%202.0/SaaS/src/core/base.repository.ts) abstraction to enforce DRY and prevent duplicate CRUD boilerplate.
* **Authentication & Authorization**:
  * JWT access tokens and secure, rotateable refresh tokens.
  * Role-Based Access Control (RBAC) supporting `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, and `SUPPORT`.
* **CRM Core Modules**:
  * Tenant-scoped management of Users, Leads, Companies, Contacts, Deals, Activities, Settings, and Audit Logs.
* **Security Hardening**:
  * Dynamic global rate-limiting tailored for development, production, and high-speed testing.
  * Centralized tenant scoping to prevent cross-tenant data leaks.
* **Automated Testing (62/62 tests passing)**:
  * 33 Unit Tests mocking database layers.
  * 20 Integration Tests verifying strict cross-tenant boundary isolation.
  * 9 End-to-End integration flows mimicking complete user-lead lifecycles.

---

## 🛠️ Prerequisites

* **Node.js**: `>= 20.x`
* **npm**: `>= 9.x`
* **MySQL / MariaDB**: Running natively (default port `3306`) or via Docker.

---

## ⚙️ Configuration & Environment Setup

Create a `.env` file in the root directory. Use the following production-ready configuration template:

```env
PORT=3001
NODE_ENV=development

# Database configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
DATABASE_NAME=test_crm
DATABASE_PORT=3306
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/test_crm"

# Authentication Secrets
JWT_SECRET=your-secure-jwt-access-secret-key-change-in-production
JWT_REFRESH_SECRET=your-secure-jwt-refresh-secret-key-change-in-production
JWT_EXPIRES_IN=15m

# Tenancy configuration
TENANCY_MODE=field

# Security parameters
BCRYPT_SALT_ROUNDS=10
```

---

## 📥 Getting Started & Installation

Follow these steps to set up the codebase locally for development and testing:

### 1. Install Dependencies
```bash
npm install
```

### 2. Streamlined Database Setup
Generate the Prisma client, apply database migrations, and seed mock data for multiple test tenants in a single command:
```bash
npm run db:setup
```

### 3. Run the Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3001` (or your configured `PORT`).
* **Swagger API Documentation** is available at: `http://localhost:3001/api/v1/docs`

---

## 🧪 Seeding & Test Data

The database setup automatically populates two distinct tenants with mock CRM records for testing cross-tenant isolation and frontend validation:

| Tenant | Admin Credentials | Role | Sample Data Included |
| :--- | :--- | :--- | :--- |
| **Acme Corp** | `admin@acme.com` / `password123` | `ADMIN` | Companies, Contacts, Leads, Deals, settings, and activity call logs. |
| **Wayne Enterprises** | `admin@wayne.com` / `password123` | `ADMIN` | Companies, Contacts, Leads, Deals, settings, and activity meeting logs. |

*To manually trigger database re-seeding at any time, run:*
```bash
npm run db:seed
```

---

## 🧪 Running the Test Suite

We use **Vitest** for running unit and integration test suites.

* **Run all tests once:**
  ```bash
  npm test
  ```
* **Run tests in watch mode:**
  ```bash
  npm run test:watch
  ```

---

## 📦 Docker Container Setup

If you prefer to run the application using Docker:

### 1. Build and start containers
```bash
docker compose up -d --build
```

### 2. Run migrations inside the container
```bash
docker compose exec app npx prisma migrate dev
```

### 3. Stop containers
```bash
docker compose down
```

---

## 🚀 Production Deployment Guidelines

When deploying this backend to production, follow these best practices:

### 1. Build Compilation
Compile the TypeScript source code into highly optimized JavaScript:
```bash
npm run build
```

### 2. Apply Database Migrations
Always use the `deploy` migration command in CI/CD pipelines to apply migrations without schema drifts or interactive prompts:
```bash
npm run prisma:migrate:deploy
```

### 3. Start Production Server
Run the compiled code directly with Node.js or a process manager like PM2:
```bash
npm start
```
Or with PM2:
```bash
pm2 start dist/src/server.js --name crm-backend
```

### 4. Production Security Checklist
* **Enforce HTTPS**: Ensure your API is served behind a reverse proxy (e.g., Nginx, Cloudflare) that enforces TLS/HTTPS.
* **Verify JWT Secrets**: Generate strong, high-entropy secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.
* **Tweak Rate Limits**: Ensure the global rate limiters in [rateLimiter.ts](file:///c:/Danish/Projects%202.0/SaaS/src/middlewares/rateLimiter.ts) are active (they automatically drop max requests limit in production to prevent DDoS).
* **Enable Helmet & CORS**: Secure headers and cross-origin access are enabled by default in [app.ts](file:///c:/Danish/Projects%202.0/SaaS/src/app.ts). Modify CORS origins to whitelist only your production frontend domain.

---

## 📂 Project Structure

```
src/
├── config/             # Config loaders and Zod schema validation
├── core/               # Database initialization, Logger, Swagger, and Custom Errors
│   ├── base.repository.ts   # Centralized generic repository class
│   └── swagger.ts           # Swagger documentation configurations
├── middlewares/        # Authentication, RBAC, Rate-Limiting, and Validation
├── modules/            # CRM business modules
│   ├── [module]/
│   │   ├── __tests__/  # Unit and integration tests
│   │   ├── dto.ts      # Data validation schemas (Zod)
│   │   ├── *.controller.ts # Request and response handlers
│   │   ├── *.repo.ts       # Database queries extending BaseRepository
│   │   └── *.service.ts    # Business logic layer
├── routes/             # Express API router registration
├── jobs/               # Background cron jobs and reminders
├── utils/              # Helper functions (Sanitization, Audit logs)
├── test/               # Setup files and integration test suites
├── app.ts              # Express application configuration
└── server.ts           # HTTP server entry point
```