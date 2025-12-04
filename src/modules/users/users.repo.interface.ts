import { User, Role } from "../../core/db";

export interface IUsersRepository {
  create(
    tenantId: string,
    email: string,
    passwordHash: string,
    role: Role,
    name?: string
  ): Promise<User>;

  findById(
    tenantId: string,
    userId: string
  ): Promise<User | null>;

  findByEmail(
    tenantId: string,
    email: string
  ): Promise<User | null>;

  findAll(
    tenantId: string
  ): Promise<User[]>;

  update(
    tenantId: string,
    userId: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      name?: string | null;
      role: Role;
      isActive: boolean;
    }>
  ): Promise<User>;

  delete(
    tenantId: string,
    userId: string
  ): Promise<void>;

  deactivate(
    tenantId: string,
    userId: string
  ): Promise<User>;
}
