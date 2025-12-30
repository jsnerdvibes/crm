import { z } from 'zod';

/**
 * Internal Create Audit Log DTO
 * This is only used by auditService (not exposed to client).
 */
export const CreateAuditLogSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),

  action: z.string().min(1, { message: 'Action is required' }),
  resource: z.string().min(1, { message: 'Resource is required' }),
  resourceId: z.string().uuid({ message: 'Resource ID must be a valid UUID' }),

  meta: z.record(z.string(), z.any()).optional(),
});

export type CreateAuditLogDTO = z.infer<typeof CreateAuditLogSchema>;

/**
 * Query Filter DTO — useful for admin/audit logs filtering.
 * Not necessarily needed today, but will be used soon.
 */
export const AuditLogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),

  resource: z.string().optional(),
  resourceId: z.string().uuid().optional(),
  action: z.string().optional(),

  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type AuditLogQueryDTO = z.infer<typeof AuditLogQuerySchema>;

/**
 * Audit Log Response Types
 */
export interface AuditLogResponse {
  id: string;
  tenantId: string;
  userId?: string | null;

  action: string;
  resource: string;
  resourceId: string;

  meta?: any;
  createdAt: Date;
}

export interface AuditLogListResponse {
  logs: AuditLogResponse[];
  page: number;
  limit: number;
  total: number;
}
