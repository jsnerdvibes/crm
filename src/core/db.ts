import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { config } from '../config';
import { tenantScope, PrismaQuery } from './tenantScope';

export * from '../../generated/prisma/client';

const TENANT_DATABASE_NAME_REGEX = /^[A-Za-z0-9_]+$/;

function assertValidTenantDatabaseName(tenantId: string) {
  if (!TENANT_DATABASE_NAME_REGEX.test(tenantId)) {
    throw new Error('Invalid tenant identifier');
  }

  return tenantId;
}

// ---- Singleton Prisma Client (Prevents Hot Reload Leaks) ---- //
declare global {
  var __prisma: PrismaClient | undefined;
}

const adapter = new PrismaMariaDb({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.dbName,
  connectionLimit: 5,
});

const prisma =
  global.__prisma ??
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (config.app.env !== 'production') {
  global.__prisma = prisma;
}

// ---- Multi-Tenant Wrapper ---- //
/**

* Returns a Prisma client scoped to a tenant.
* Supports:
* * schema → switches database schema using USE <tenant_schema>
* * field  → injects tenantId into all queries automatically
    */
export function db(tenantId?: string) {
  const mode = config.tenancy.mode;
  const tenantDatabaseName =
    mode === 'schema' && tenantId
      ? assertValidTenantDatabaseName(tenantId)
      : undefined;

  // -------- SCHEMA MODE -------- //
  if (mode === 'schema') {
    if (!tenantId)
      throw new Error('❌ tenantId is required when TENANCY_MODE=schema');

    return prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ query, args }) {
            // Switch MariaDB schema (database)
            await prisma.$executeRawUnsafe(`USE \`${tenantDatabaseName}\`;`);
            return query(args);
          },
        },
      },
    });
  }

  // -------- FIELD MODE -------- //
  if (mode === 'field') {
    if (!tenantId)
      throw new Error('❌ tenantId is required when TENANCY_MODE=field');

    return prisma.$extends({
      query: {
        $allModels: {
          async $allOperations({ query, args }) {
            // Wrap args with tenantScope to inject tenantId consistently
            const scopedArgs: PrismaQuery = { ...args };
            return query(tenantScope(scopedArgs, tenantId));
          },
        },
      },
    });
  }

  // -------- DEFAULT: no multi-tenancy -------- //
  return prisma;
}

export { prisma };
