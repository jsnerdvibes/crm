import { User, Role } from '../../core/db';
import { IBaseRepository } from '../../core/base.repository';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: Role;
  name?: string;
}

export interface UpdateUserInput {
  email?: string;
  passwordHash?: string;
  name?: string | null;
  role?: Role;
  isActive?: boolean;
}

export interface IUsersRepository extends IBaseRepository<User, CreateUserInput, UpdateUserInput> {
  findByEmail(tenantId: string, email: string): Promise<User | null>;
  findAll(tenantId: string): Promise<User[]>;
  deactivate(tenantId: string, userId: string): Promise<User>;
}
