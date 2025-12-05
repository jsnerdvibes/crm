import { z } from 'zod';
import { LeadStatus } from '../../core/db';

/**
 * Create Lead DTO
 * tenantId is injected from JWT, not provided by client.
 */
export const CreateLeadSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),

  description: z.string().optional(),
  source: z.string().optional(),

  status: z.enum(LeadStatus).default(LeadStatus.NEW),

  contactId: z.string().uuid().optional(),

  assignedToId: z.string().uuid().optional(),
});

export type CreateLeadDTO = z.infer<typeof CreateLeadSchema>;

/**
 * Update Lead DTO
 * Allows partial updates.
 */
export const UpdateLeadSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  status: z.enum(LeadStatus).optional(),
  contactId: z.string().uuid().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export type UpdateLeadDTO = z.infer<typeof UpdateLeadSchema>;



/**
 * Assign Lead DTO
 * Assign a lead to a user
 */
export const AssignLeadSchema = z.object({
  leadId: z.string({ error: 'Lead ID is required' }),
  assignedToId: z.string({ error: 'User ID is required' }),
});

export type AssignLeadDTO = z.infer<typeof AssignLeadSchema>;


/**
 * Lead Filter / Search DTO
 * Used for listing leads with filters
 */
export const LeadFilterSchema = z.object({
  status: z.enum(LeadStatus).optional(),
  assignedToId: z.string().optional(),
  title: z.string().optional(),
  contactEmail: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(20),
  source: z.string().optional()
});

export type LeadFilterDTO = z.infer<typeof LeadFilterSchema>;


/**
 * Lead Filters (GET /leads)
 * - Pagination
 * - Search
 * - Status filter
 * - AssignedTo filter
 */
export const LeadQuerySchema = z.object({
  page: z.string().optional(), // convert in controller → number
  limit: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(LeadStatus).optional(),
  assignedToId: z.string().uuid().optional(),
});

export type LeadQueryDTO = z.infer<typeof LeadQuerySchema>;

/**
 * Response Types
 */
export interface LeadResponse {
  id: string;
  title: string;
  description?: string | null;
  source?: string | null;
  status: LeadStatus;
  contactId?: string | null;
  assignedToId?: string | null;
  createdAt: Date;
}

export interface LeadListResponse {
  leads: LeadResponse[];
  page: number;
  limit: number;
  total: number;
}
