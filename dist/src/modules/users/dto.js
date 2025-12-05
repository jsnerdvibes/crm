"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const db_1 = require("../../core/db");
/**
 * Create User DTO
 * Admin creates a user inside their tenant.
 * tenantId is extracted from JWT, not provided by client.
 */
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.email({ message: 'Valid email is required' }),
    password: zod_1.z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
    name: zod_1.z.string().optional(),
    role: zod_1.z.enum(db_1.Role, { message: 'Invalid role' }).default(db_1.Role.SALES),
});
/**
 * Update User DTO
 * Partial updates allowed.
 * Password change allowed only if explicitly provided.
 */
exports.UpdateUserSchema = zod_1.z.object({
    email: zod_1.z.email().optional(),
    password: zod_1.z.string().min(6).optional(),
    name: zod_1.z.string().optional(),
    role: zod_1.z.enum(db_1.Role).optional(),
    isActive: zod_1.z.boolean().optional(),
});
