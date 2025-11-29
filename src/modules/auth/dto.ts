import { z } from 'zod';

export const RegisterSchema = z.object({
  tenantName: z.string().min(1, { message: 'Tenant name is required' }),
  email: z.email({ message: 'Valid email is required' }),
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


export const LoginSchema = z.object({
  email: z.email({ message: 'Valid email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginDTO = z.infer<typeof LoginSchema>;



export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
});

export type RefreshTokenDTO = z.infer<typeof RefreshTokenSchema>;