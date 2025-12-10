import { z } from 'zod';
import { ActivityType } from '../../core/db';

/**
 * Allowed polymorphic target types
 */
export const TargetTypes = ['Lead', 'Contact', 'Deal', 'Company'] as const;
export type TargetType = (typeof TargetTypes)[number];

/**
 * Create Activity DTO
 * tenantId and actorId are injected from JWT.
 */
export const CreateActivitySchema = z.object({
  type: z.enum(ActivityType, { message: 'Invalid activity type' }),

  targetType: z.enum(TargetTypes, {
    message: 'Target Type must be Lead, Contact, Deal, or Company',
  }),

  targetId: z.string().uuid({ message: 'Invalid targetId' }),

  body: z.string().optional(),

  dueAt: z
    .string()
    .datetime({ offset: true })
    .optional(),

  completed: z.boolean().optional(),
});

export type CreateActivityDTO = z.infer<typeof CreateActivitySchema>;

/**
 * Update Activity DTO
 * Allows partial updates.
 */
export const UpdateActivitySchema = z.object({
  body: z.string().optional(),
  dueAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .nullable(),
  completed: z.boolean().optional(),
});

export type UpdateActivityDTO = z.infer<typeof UpdateActivitySchema>;

/**
 * Response Types
 */
export interface ActivityResponse {
  id: string;
  tenantId: string;
  type: ActivityType;
  targetType: TargetType;
  targetId: string;
  body?: string | null;
  dueAt?: Date | null;
  completed: boolean;
  actorId?: string | null;
  createdAt: Date;
}

export interface ActivityListResponse {
  activities: ActivityResponse[];
  page: number;
  limit: number;
  total: number;
}
