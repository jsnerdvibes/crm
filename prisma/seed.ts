import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';
import { logger } from '../src/core/logger';
import bcrypt from 'bcrypt';
import { config } from '../src/config';

const adapter = new PrismaMariaDb({
  host: config.database.host!,
  user: config.database.user!,
  password: config.database.password!,
  database: config.database.dbName!,
  port: Number(config.database.dbPort || 3306),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  logger.info('Clearing database tables...');
  
  // Clean up existing data in reverse order of dependencies
  await prisma.activity.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.contact.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.tenant.deleteMany({});

  logger.info('Seeding database with multi-tenant test data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1️⃣ Create Tenant A: Acme Corp
  const tenantA = await prisma.tenant.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  });

  const adminA = await prisma.user.create({
    data: {
      tenantId: tenantA.id,
      email: 'admin@acme.com',
      passwordHash,
      name: 'Acme Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const userA = await prisma.user.create({
    data: {
      tenantId: tenantA.id,
      email: 'user@acme.com',
      passwordHash,
      name: 'Acme Sales',
      role: 'SALES',
      isActive: true,
    },
  });

  // 2️⃣ Create Tenant B: Wayne Enterprises
  const tenantB = await prisma.tenant.create({
    data: {
      name: 'Wayne Enterprises',
      slug: 'wayne-enterprises',
    },
  });

  const adminB = await prisma.user.create({
    data: {
      tenantId: tenantB.id,
      email: 'admin@wayne.com',
      passwordHash,
      name: 'Wayne Admin',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const userB = await prisma.user.create({
    data: {
      tenantId: tenantB.id,
      email: 'user@wayne.com',
      passwordHash,
      name: 'Wayne Sales',
      role: 'SALES',
      isActive: true,
    },
  });

  // 3️⃣ Seed Acme Corp Data
  const companyA = await prisma.company.create({
    data: {
      tenantId: tenantA.id,
      name: 'Acme Tech Partner',
      website: 'https://acmetech.com',
    },
  });

  const contactA = await prisma.contact.create({
    data: {
      tenantId: tenantA.id,
      companyId: companyA.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@acmetech.com',
    },
  });

  const leadA = await prisma.lead.create({
    data: {
      tenantId: tenantA.id,
      title: 'Acme Server Cloud Deal',
      description: 'Interested in hosting',
      status: 'NEW',
      contactId: contactA.id,
      assignedToId: userA.id,
    },
  });

  const dealA = await prisma.deal.create({
    data: {
      tenantId: tenantA.id,
      title: 'Acme Integration Contract',
      amount: 50000,
      stage: 'QUALIFICATION',
      companyId: companyA.id,
      assignedToId: userA.id,
    },
  });

  await prisma.activity.create({
    data: {
      tenantId: tenantA.id,
      actorId: userA.id,
      type: 'CALL',
      targetType: 'Lead',
      targetId: leadA.id,
      body: 'Introductory call with John',
      completed: true,
    },
  });

  await prisma.setting.create({
    data: {
      tenantId: tenantA.id,
      key: 'theme',
      value: 'dark',
    },
  });

  // 4️⃣ Seed Wayne Enterprises Data
  const companyB = await prisma.company.create({
    data: {
      tenantId: tenantB.id,
      name: 'Wayne BatTech',
      website: 'https://battech.wayne.com',
    },
  });

  const contactB = await prisma.contact.create({
    data: {
      tenantId: tenantB.id,
      companyId: companyB.id,
      firstName: 'Bruce',
      lastName: 'Wayne',
      email: 'bruce@wayne.com',
    },
  });

  const leadB = await prisma.lead.create({
    data: {
      tenantId: tenantB.id,
      title: 'Wayne Armor Supply',
      description: 'Plating requirements',
      status: 'NEW',
      contactId: contactB.id,
      assignedToId: userB.id,
    },
  });

  const dealB = await prisma.deal.create({
    data: {
      tenantId: tenantB.id,
      title: 'Wayne Defense Contract',
      amount: 1000000,
      stage: 'QUALIFICATION',
      companyId: companyB.id,
      assignedToId: userB.id,
    },
  });

  await prisma.activity.create({
    data: {
      tenantId: tenantB.id,
      actorId: userB.id,
      type: 'MEETING',
      targetType: 'Lead',
      targetId: leadB.id,
      body: 'Meeting in cave',
      completed: false,
    },
  });

  await prisma.setting.create({
    data: {
      tenantId: tenantB.id,
      key: 'theme',
      value: 'light',
    },
  });

  logger.info('Seeding finished successfully.');
}

main()
  .catch((e) => {
    logger.error(e, 'Error seeding database');
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

