CRM Project
Overview

This is a Node.js + TypeScript backend for the CRM project, using Prisma ORM with MySQL. Development can be done locally or using Docker. Prisma migrations are used to manage the database schema. Environment variables are loaded from .env.

Project Structure

/crm
│ package.json
│ tsconfig.json
│ Dockerfile
│ docker-compose.yml
│ .dockerignore
│ .env
└─ prisma
│ └─ schema.prisma
└─ src
└─ server.ts

Prerequisites

Node.js >= 20

npm >= 9

Docker & Docker Compose (for Docker setup)

MySQL client (optional, for local debugging)

Environment Variables

Create a .env file at the project root:

PORT=3001
NODE_ENV=development

DATABASE_HOST=mysql
DATABASE_USER=root
DATABASE_PASSWORD=root123
DATABASE_NAME=crm_docker
DATABASE_PORT=3306

DATABASE_URL="mysql://root:root123@mysql:3306/crm_docker"

JWT_SECRET=this-is-a-long-jwt-secret-string
JWT_REFRESH_SECRET=this-is-a-long-jwt-secret-string

BCRYPT_SALT_ROUNDS=10

Note: For local setup without Docker, use DATABASE_HOST=localhost and ensure a MySQL instance is running locally.

1️⃣ Local Development Setup

Install dependencies:
npm install

Generate Prisma client:
npx prisma generate

Run database migrations:
npx prisma migrate dev

Start the development server:
npm run dev

The server runs on http://localhost:3001
 (or the port in .env). Hot reload is enabled via ts-node-dev.

2️⃣ Dockerized Setup (Recommended)

Build Docker images:
sudo docker compose build --no-cache

Start containers:
sudo docker compose up -d

MySQL container: saas_mysql

Node app container: saas_app

App available at http://localhost:3001

Run Prisma migrations inside Docker:
sudo docker compose exec app npx prisma migrate dev

Stop containers:
sudo docker compose down

Optional: Remove old/orphan containers:
sudo docker compose down --remove-orphans

3️⃣ Notes / Best Practices

Docker app uses internal Docker networking. DATABASE_HOST=mysql must be used inside the container.

.env is loaded automatically in Docker via env_file.

For development, volumes are mounted to allow hot reload (src folder) and persistent MySQL data (mysql_data volume).

For production:

Use multi-stage Docker builds (npm run build + node dist/src/server.js)

Separate .env.production for secrets

Consider managed MySQL for better reliability

4️⃣ Useful Commands
Command	Description
npm install	Install project dependencies
npx prisma generate	Generate Prisma client
npx prisma migrate dev	Apply migrations to database
npm run dev	Run Node server in dev mode
sudo docker compose build --no-cache	Build Docker images from scratch
sudo docker compose up -d	Start containers in detached mode
sudo docker compose down	Stop containers
sudo docker compose exec app npx prisma migrate dev	Run Prisma migrations inside container
sudo docker compose logs -f app	View Node app logs
sudo docker compose logs -f mysql	View MySQL logs
5️⃣ References

Prisma Docs

Docker Docs

Node.js Docs

This README now covers local setup, Docker setup, and Prisma migrations, so your team can follow the same steps consistently.

You can also add a “one-command setup” for new developers, where Docker handles migrations and starts the server automatically, eliminating the need to run npx prisma migrate dev manually.