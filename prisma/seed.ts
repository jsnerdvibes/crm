import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import {logger} from '../src/core/logger'
import bcrypt from 'bcrypt';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  port: Number(process.env.DATABASE_PORT || 3306),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  logger.info('Seeding database...');

  // 1️⃣ Create first tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });

  const passwordHash = await bcrypt.hash('superadmin', 10);

  // 2️⃣ Create Super Admin user
  const superAdmin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'superadmin@example.com',
      passwordHash,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  logger.info({ tenant, superAdmin }, 'Tenant and Super Admin created');
}

main()
  .catch((e) => {
    logger.error(e, 'Error seeding database');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
