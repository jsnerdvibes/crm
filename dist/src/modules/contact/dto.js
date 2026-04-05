"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContactSchema = exports.CreateContactSchema = void 0;
// modules/contacts/dto.ts
const zod_1 = require("zod");
/**
 * Create Contact DTO
 * tenantId is extracted from JWT, not provided by client.
 */
exports.CreateContactSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid().optional(),
    firstName: zod_1.z.string({ error: 'First name is required' }),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.email().optional(),
    phone: zod_1.z.string().optional(),
});
/**
 * Update Contact DTO
 * Partial updates allowed.
 */
exports.UpdateContactSchema = zod_1.z.object({
    companyId: zod_1.z.string().uuid().optional(),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
});
