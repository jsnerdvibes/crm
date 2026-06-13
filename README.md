# Multi-Tenant SaaS CRM Backend

This is a production-ready, multi-tenant SaaS backend for a CRM application built with **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** with **MySQL/MariaDB**.

---

## 🚀 Key Features

* **Multi-Tenancy Support**:
  * **Schema Isolation**: Separate databases per tenant.
  * **Field Isolation**: Automatic tenant scoping at the Prisma client level.
* **Authentication & Authorization**:
  * JWT access tokens and secure, rotateable refresh tokens.
  * Role-Based Access Control (RBAC) supporting `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `SALES`, and `SUPPORT`.
* **CRM Core Modules**:
  * Scoped management of Users, Leads, Companies, Contacts, Deals, Activities, Settings, and Audit Logs.
* **Security & Performance**:
  * Global rate limiting configured dynamically for development/production.
  * Strict cross-tenant isolation enforcement.
* **Automated Testing**:
  * 33 Unit Tests mocking the database layers.
  * 20 Integration Tests verifying strict cross-tenant boundary isolation using `supertest`.
  * 9 End-to-End Integration Flow Tests simulating complete CRM lifecycle workflows.

---

## 🛠️ Prerequisites

* **Node.js**: `>= 20.x`
* **npm**: `>= 9.x`
* **MySQL / MariaDB**: Running locally on port `3306` (or via Docker)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development

# Database configuration
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=root123
DATABASE_NAME=test_crm
DATABASE_PORT=3306
DATABASE_URL="mysql://root:root123@localhost:3306/test_crm"

# Authentication Secrets
JWT_SECRET=this-is-a-long-jwt-secret-string
JWT_REFRESH_SECRET=this-is-a-long-jwt-secret-string
JWT_EXPIRES_IN=15m

# Tenancy mode ('schema' or 'field')
TENANCY_MODE=schema

BCRYPT_SALT_ROUNDS=10
```

---

## 📥 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Run Migrations
```bash
npx prisma migrate dev
```

### 4. Seed Database (with two test tenants)
```bash
npx ts-node prisma/seed.ts
```

### 5. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3001` (or the configured `PORT`).

---

## 🧪 Running Tests

We use **Vitest** for running both unit and integration tests.

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

*Note: Integration tests run against the local MySQL instance configured in your `.env`. Make sure the database is running and has been seeded before executing tests.*

---

## 📦 Docker Setup

You can also run the application and database containerized:

### Build & Run Containers
```bash
docker compose up -d --build
```

### Run Migrations inside Container
```bash
docker compose exec app npx prisma migrate dev
```

### Stop Containers
```bash
docker compose down
```

---

## 📂 Project Structure

```
src/
├── config/             # Config loaders and Zod schema validation
├── core/               # Database initialization, Logger, Swagger, and Custom Errors
├── middlewares/        # Authentication, RBAC, Rate-Limiting, and Validation
├── modules/            # CRM business modules (Auth, User, Lead, Contact, Company, etc.)
│   ├── [module]/
│   │   ├── __tests__/  # Unit and integration tests
│   │   ├── dto.ts      # Data validation schemas (Zod)
│   │   ├── controller  # Request and response handlers
│   │   ├── repository  # Direct database queries (Prisma)
│   │   └── service     # Business logic layer
├── routes/             # Root express routes assembly
├── jobs/               # Background cron jobs and reminders
├── utils/              # Helper functions (Sanitization, Audit log utility)
├── test/               # Setup files and integration test suites
├── app.ts              # Express application configuration
└── server.ts           # HTTP server entry point
```