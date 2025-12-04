import { z } from 'zod';
import { Role } from '../../core/db';

/**
 * Create User DTO
 * Admin creates a user inside their tenant.
 * tenantId is extracted from JWT, not provided by client.
 */
export const CreateUserSchema = z.object({
  email: z.email({ message: 'Valid email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  name: z.string().optional(),
  role: z.enum(Role, { message: 'Invalid role' }).default(Role.SALES),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

/**
 * Update User DTO
 * Partial updates allowed.
 * Password change allowed only if explicitly provided.
 */
export const UpdateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().optional(),
  role: z.enum(Role).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

/**
 * Response types
 */

export interface UserResponse {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListResponse {
  users: UserResponse[];
}
