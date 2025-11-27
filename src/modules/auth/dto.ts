import { z } from 'zod';

export const RegisterSchema = z.object({
  tenantName: z.string().min(1, { message: 'Tenant name is required' }),
  email: z.string().email({ message: 'Valid email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export interface RegisterResponse {
  message: string;
  tenantId: string;
  adminUserId: string;
}
