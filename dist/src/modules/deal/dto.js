"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDealStageSchema = exports.AssignDealSchema = exports.UpdateDealSchema = exports.CreateDealSchema = void 0;
const zod_1 = require("zod");
const db_1 = require("../../core/db");
/**
 * Create Deal DTO
 * tenantId is extracted from JWT and injected by middleware.
 */
exports.CreateDealSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, { message: 'Title is required' }),
    amount: zod_1.z.number().optional(),
    probability: zod_1.z.number().min(0).max(100).optional(),
    stage: zod_1.z.enum(db_1.DealStage).default(db_1.DealStage.QUALIFICATION),
    companyId: zod_1.z.string().uuid().optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
});
/**
 * Update Deal DTO
 * Allows partial updates.
 */
exports.UpdateDealSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    amount: zod_1.z.number().optional(),
    probability: zod_1.z.number().min(0).max(100).optional(),
    stage: zod_1.z.enum(db_1.DealStage).optional(),
    companyId: zod_1.z.string().uuid().optional(),
    assignedToId: zod_1.z.string().uuid().optional(),
});
/**
 * Assignment DTO
 */
exports.AssignDealSchema = zod_1.z.object({
    assignedToId: zod_1.z.string().uuid(),
});
/**
 * Stage Update DTO
 */
exports.UpdateDealStageSchema = zod_1.z.object({
    stage: zod_1.z.enum(db_1.DealStage, { message: 'Invalid deal stage' }),
});
