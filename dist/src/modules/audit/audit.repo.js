"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const db_1 = require("../../core/db");
class AuditRepository {
    /**
     * Create a new audit log entry
     */
    async create(data) {
        return db_1.prisma.auditLog.create({
            data: {
                tenantId: data.tenantId,
                userId: data.userId || null,
                action: data.action,
                resource: data.resource,
                resourceId: data.resourceId,
                meta: data.meta || {}, // MySQL JSON supported
            },
        });
    }
    /**
     * Get audit logs for a tenant with filters + pagination
     */
    async findAll(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (filters.resource)
            where.resource = filters.resource;
        if (filters.resourceId)
            where.resourceId = filters.resourceId;
        if (filters.action)
            where.action = filters.action;
        // Date filtering
        if (filters.from || filters.to) {
            where.createdAt = {};
            if (filters.from)
                where.createdAt.gte = new Date(filters.from);
            if (filters.to)
                where.createdAt.lte = new Date(filters.to);
        }
        const logs = await db_1.prisma.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        const total = await db_1.prisma.auditLog.count({ where });
        return { logs, total };
    }
    /**
     * Get a single audit log by ID (tenant scoped)
     */
    async findById(tenantId, id) {
        return db_1.prisma.auditLog.findFirst({
            where: { id, tenantId },
        });
    }
}
exports.AuditRepository = AuditRepository;
