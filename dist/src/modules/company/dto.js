"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanySchema = exports.CreateCompanySchema = void 0;
const zod_1 = require("zod");
/**
 * Create Company DTO
 * tenantId is extracted from JWT, NOT sent by client.
 */
exports.CreateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Company name is required' }),
    website: zod_1.z.string().url({ message: 'Invalid website URL' }).optional(),
    phone: zod_1.z.string().min(6, { message: 'Phone number is too short' }).optional(),
    address: zod_1.z.string().optional(),
});
/**
 * Update Company DTO
 * Partial update allowed.
 */
exports.UpdateCompanySchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
});
