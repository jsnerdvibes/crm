// modules/contacts/dto.ts
import { z } from 'zod';

/**
 * Create Contact DTO
 * tenantId is extracted from JWT, not provided by client.
 */
export const CreateContactSchema = z.object({
  companyId: z.string().uuid().optional(),
  firstName: z.string({ error: 'First name is required' }),
  lastName: z.string().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
});

export type CreateContactDTO = z.infer<typeof CreateContactSchema>;

/**
 * Update Contact DTO
 * Partial updates allowed.
 */
export const UpdateContactSchema = z.object({
  companyId: z.string().uuid().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export type UpdateContactDTO = z.infer<typeof UpdateContactSchema>;

/**
 * Response types
 */
export interface ContactResponse {
  id: string;
  companyId?: string | null;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  createdAt: Date;
}

export interface ContactListResponse {
  contacts: ContactResponse[];
}
