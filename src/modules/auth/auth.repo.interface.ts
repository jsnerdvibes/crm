// src/modules/auth/auth.repo.interface.ts

import { BatchPayload } from '../../../generated/prisma/internal/prismaNamespace';
import { User, Tenant, Role, RefreshToken } from '../../core/db';

export interface IAuthRepository {
  createTenant(name: string, slug: string): Promise<Tenant>;
  createDefaultSettings(tenantId: string): Promise<BatchPayload>;
  createUser(
    tenantId: string,
    email: string,
    passwordHash: string,
    role: Role
  ): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;

  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<RefreshToken>;
  findRefreshToken(
    token: string
  ): Promise<(RefreshToken & { user: User }) | null>;
  findRefreshToken(token: string): Promise<RefreshToken | null>;
  revokeRefreshToken(id: string): Promise<void>;
  revokeRefreshTokenByToken(token: string): Promise<number>;
}
