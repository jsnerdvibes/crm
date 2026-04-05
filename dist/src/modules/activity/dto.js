"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateActivitySchema = exports.CreateActivitySchema = exports.TargetTypes = void 0;
const zod_1 = require("zod");
const db_1 = require("../../core/db");
/**
 * Allowed polymorphic target types
 */
exports.TargetTypes = ['Lead', 'Contact', 'Deal', 'Company'];
/**
 * Create Activity DTO
 * tenantId and actorId are injected from JWT.
 */
exports.CreateActivitySchema = zod_1.z.object({
    type: zod_1.z.enum(db_1.ActivityType, { message: 'Invalid activity type' }),
    targetType: zod_1.z.enum(exports.TargetTypes, {
        message: 'Target Type must be Lead, Contact, Deal, or Company',
    }),
    targetId: zod_1.z.string().uuid({ message: 'Invalid targetId' }),
    body: zod_1.z.string().optional(),
    dueAt: zod_1.z.string().datetime({ offset: true }).optional(),
    completed: zod_1.z.boolean().optional(),
});
/**
 * Update Activity DTO
 * Allows partial updates.
 */
exports.UpdateActivitySchema = zod_1.z.object({
    body: zod_1.z.string().optional(),
    dueAt: zod_1.z.string().datetime({ offset: true }).optional().nullable(),
    completed: zod_1.z.boolean().optional(),
});
