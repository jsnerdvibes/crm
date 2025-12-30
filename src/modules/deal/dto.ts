import { z } from 'zod';
import { DealStage } from '../../core/db';

/**
 * Create Deal DTO
 * tenantId is extracted from JWT and injected by middleware.
 */
export const CreateDealSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  amount: z.number().optional(),
  probability: z.number().min(0).max(100).optional(),
  stage: z.enum(DealStage).default(DealStage.QUALIFICATION),
  companyId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
});

export type CreateDealDTO = z.infer<typeof CreateDealSchema>;

/**
 * Update Deal DTO
 * Allows partial updates.
 */
export const UpdateDealSchema = z.object({
  title: z.string().optional(),
  amount: z.number().optional(),
  probability: z.number().min(0).max(100).optional(),
  stage: z.enum(DealStage).optional(),
  companyId: z.string().uuid().optional(),
  assignedToId: z.string().uuid().optional(),
});

export type UpdateDealDTO = z.infer<typeof UpdateDealSchema>;

/**
 * Assignment DTO
 */
export const AssignDealSchema = z.object({
  assignedToId: z.string().uuid(),
});

export type AssignDealDTO = z.infer<typeof AssignDealSchema>;

/**
 * Stage Update DTO
 */
export const UpdateDealStageSchema = z.object({
  stage: z.enum(DealStage, { message: 'Invalid deal stage' }),
});

export type UpdateDealStageDTO = z.infer<typeof UpdateDealStageSchema>;

/**
 * Response types
 */
export interface DealResponse {
  id: string;
  title: string;
  amount?: number | null;
  probability?: number | null;
  stage: DealStage;
  companyId?: string | null;
  assignedToId?: string | null;
  createdAt: Date;
}

export interface DealListResponse {
  deals: DealResponse[];
}
