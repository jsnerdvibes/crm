import { z } from 'zod';

/**
 * Create Company DTO
 * tenantId is extracted from JWT, NOT sent by client.
 */
export const CreateCompanySchema = z.object({
  name: z.string().min(1, { message: 'Company name is required' }),
  website: z.string().url({ message: 'Invalid website URL' }).optional(),
  phone: z.string().min(6, { message: 'Phone number is too short' }).optional(),
  address: z.string().optional(),
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;

/**
 * Update Company DTO
 * Partial update allowed.
 */
export const UpdateCompanySchema = z.object({
  name: z.string().optional(),
  website: z.string().url().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;

/**
 * Response Types
 */
export interface CompanyResponse {
  id: string;
  name: string;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}

export interface CompanyListResponse {
  companies: CompanyResponse[];
}
