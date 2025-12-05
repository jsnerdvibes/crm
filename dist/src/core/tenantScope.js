"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tenantScope = tenantScope;
/**
 * Injects tenantId into a Prisma query for field-based multi-tenancy
 */
function tenantScope(query, tenantId) {
    if (!tenantId) {
        throw new Error('tenantId is required in field mode');
    }
    return {
        ...query,
        where: {
            ...query.where,
            tenantId,
        },
    };
}
