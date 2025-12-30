import bcrypt from 'bcrypt';
import { IUsersRepository } from './users.repo.interface';
import { CreateUserDTO, UpdateUserDTO, UserResponse } from './dto';
import { Role, User } from '../../core/db';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../core/error';
import { config } from '../../config';
import { logAudit } from '../../utils/audit.log';
import { LogActions, LogResources } from '../../types/logActions';

export class UsersService {
  constructor(private repo: IUsersRepository) {}

  // -------------------------
  // Create a new user
  // -------------------------
  async createUser(
    tenantId: string,
    data: CreateUserDTO,
    performedById?: string
  ): Promise<UserResponse> {
    // check if email already exists
    const existing = await this.repo.findByEmail(tenantId, data.email);
    if (existing) {
      throw new BadRequestError('Email already exists');
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      Number(config.bcrypt.saltRounds)
    );

    const user = await this.repo.create(
      tenantId,
      data.email,
      passwordHash,
      data.role,
      data.name
    );

    const sanitized = this.sanitize(user);

    await logAudit(
      tenantId,
      performedById,
      LogActions.CREATE,
      LogResources.USER,
      user.id,
      { title: user.name }
    );

    return sanitized;
  }

  // -------------------------
  // Update existing user
  // -------------------------
  async updateUser(
    tenantId: string,
    userId: string,
    data: UpdateUserDTO,
    performedById?: string
  ): Promise<UserResponse> {
    const user = await this.repo.findById(tenantId, userId);
    if (!user) throw new NotFoundError('User not found');

    const updateData: Partial<{
      email: string;
      passwordHash: string;
      name?: string | null;
      role: Role;
      isActive: boolean;
    }> = {};

    if (data.email) updateData.email = data.email;
    if (data.name) updateData.name = data.name;
    if (data.role) updateData.role = data.role;
    if (typeof data.isActive === 'boolean') updateData.isActive = data.isActive;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(
        data.password,
        Number(config.bcrypt.saltRounds)
      );
    }

    const updatedUser = await this.repo.update(tenantId, userId, updateData);

    const sanitized = this.sanitize(updatedUser);

    await logAudit(
      tenantId,
      performedById,
      LogActions.UPDATE,
      LogResources.USER,
      user.id,
      { title: user.name }
    );

    return sanitized;
  }

  // -------------------------
  // Deactivate user
  // -------------------------
  async deactivateUser(
    tenantId: string,
    userId: string,
    performedById?: string
  ): Promise<UserResponse> {
    const userInfo = await this.repo.findById(tenantId, userId);
    if (!userInfo) throw new NotFoundError('User not found');

    if (userInfo.role === Role.ADMIN || userInfo.role === Role.SUPER_ADMIN) {
      throw new ForbiddenError('Admin users cannot be deleted');
    }

    const user = await this.repo.deactivate(tenantId, userId);

    const sanitized = this.sanitize(user);

    await logAudit(
      tenantId,
      performedById,
      LogActions.DEACTIVATE,
      LogResources.USER,
      user.id,
      { title: user.name }
    );

    return sanitized;
  }

  // -------------------------
  // Delete user
  // -------------------------
  async delete(
    tenantId: string,
    userId: string,
    performedById?: string
  ): Promise<void> {
    const user = await this.repo.findById(tenantId, userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
      throw new ForbiddenError('Admin users cannot be deleted');
    }

    await this.repo.delete(tenantId, userId);

    await logAudit(
      tenantId,
      performedById,
      LogActions.DELETE,
      LogResources.USER,
      user.id,
      { title: user.name }
    );
  }

  // -------------------------
  // Get single user
  // -------------------------
  async getUserById(tenantId: string, userId: string): Promise<UserResponse> {
    const user = await this.repo.findById(tenantId, userId);
    if (!user) throw new NotFoundError('User not found');
    return this.sanitize(user);
  }

  // -------------------------
  // Get all users in tenant
  // -------------------------
  async getAllUsers(tenantId: string): Promise<UserResponse[]> {
    const users = await this.repo.findAll(tenantId);
    return users.map(this.sanitize);
  }

  // -------------------------
  // Helper: sanitize user for response
  // -------------------------
  private sanitize(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
