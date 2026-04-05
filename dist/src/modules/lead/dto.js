"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignLeadSchema = exports.UpdateLeadSchema = exports.CreateLeadSchema = void 0;
exports.isLeadStatus = isLeadStatus;
const zod_1 = require("zod");
const db_1 = require("../../core/db");
/**
 * Create Lead DTO
 * tenantId is injected from JWT, not provided by client.
 */
exports.CreateLeadSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: 'Title is required' }),
    description: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    status: zod_1.z.enum(db_1.LeadStatus).default(db_1.LeadStatus.NEW),
    contactId: zod_1.z.string().uuid().optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
});
/**
 * Update Lead DTO
 * Allows partial updates.
 */
exports.UpdateLeadSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
    source: zod_1.z.string().optional(),
    status: zod_1.z.enum(db_1.LeadStatus).optional(),
    contactId: zod_1.z.string().uuid().optional().nullable(),
    assignedToId: zod_1.z.string().uuid().optional().nullable(),
});
/**
 * Assign Lead DTO
 * Assign a lead to a user
 */
exports.AssignLeadSchema = zod_1.z.object({
    leadId: zod_1.z.string({ error: 'Lead ID is required' }),
    assignedToId: zod_1.z.string({ error: 'User ID is required' }),
});
function isLeadStatus(value) {
    return (typeof value === 'string' &&
        Object.values(db_1.LeadStatus).includes(value));
}
