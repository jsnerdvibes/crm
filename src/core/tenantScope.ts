// src/core/tenantScope.ts
export interface PrismaQuery {
  where?: Record<string, any>;
  [key: string]: any;
}

/**
 * Injects tenantId into a Prisma query for field-based multi-tenancy
 */
export function tenantScope(query: PrismaQuery, tenantId?: string): PrismaQuery {
  if (!tenantId) {
    throw new Error("tenantId is required in field mode");
  }

  return {
    ...query,
    where: {
      ...query.where,
      tenantId,
    },
  };
}