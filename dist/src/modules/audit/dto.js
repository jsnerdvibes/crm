"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogQuerySchema = exports.CreateAuditLogSchema = void 0;
const zod_1 = require("zod");
/**
 * Internal Create Audit Log DTO
 * This is only used by auditService (not exposed to client).
 */
exports.CreateAuditLogSchema = zod_1.z.object({
    tenantId: zod_1.z.string().uuid(),
    userId: zod_1.z.string().uuid().nullable().optional(),
    action: zod_1.z.string().min(1, { message: 'Action is required' }),
    resource: zod_1.z.string().min(1, { message: 'Resource is required' }),
    resourceId: zod_1.z.string().uuid({ message: 'Resource ID must be a valid UUID' }),
    meta: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
/**
 * Query Filter DTO — useful for admin/audit logs filtering.
 * Not necessarily needed today, but will be used soon.
 */
exports.AuditLogQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().min(1).default(1),
    limit: zod_1.z.coerce.number().min(1).max(100).default(20),
    resource: zod_1.z.string().optional(),
    resourceId: zod_1.z.string().uuid().optional(),
    action: zod_1.z.string().optional(),
    from: zod_1.z.string().datetime().optional(),
    to: zod_1.z.string().datetime().optional(),
});
