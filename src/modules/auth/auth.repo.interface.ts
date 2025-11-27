// src/modules/auth/auth.repo.interface.ts

import { BatchPayload } from "../../../generated/prisma/internal/prismaNamespace";
import { User, Tenant, Role } from "../../core/db";

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
}
