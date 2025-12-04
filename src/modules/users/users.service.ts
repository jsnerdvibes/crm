import bcrypt from "bcrypt";
import { IUsersRepository } from "./users.repo.interface";
import { CreateUserDTO, UpdateUserDTO, UserResponse } from "./dto";
import { Role, User } from "../../core/db";
import { BadRequestError, NotFoundError } from "../../core/error";
import { logger } from "../../core/logger";

export class UsersService {
  constructor(private repo: IUsersRepository) {}

  // -------------------------
  // Create a new user
  // -------------------------
  async createUser(
    tenantId: string,
    data: CreateUserDTO
  ): Promise<UserResponse> {
    // check if email already exists
    const existing = await this.repo.findByEmail(tenantId, data.email);
    if (existing) {
      throw new BadRequestError("Email already exists");
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const user = await this.repo.create(
      tenantId,
      data.email,
      passwordHash,
      data.role,
      data.name
    );

    return this.sanitize(user);
  }

  // -------------------------
  // Update existing user
  // -------------------------
  async updateUser(
    tenantId: string,
    userId: string,
    data: UpdateUserDTO
  ): Promise<UserResponse> {
    const user = await this.repo.findById(tenantId, userId);
    if (!user) throw new NotFoundError("User not found");

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
    if (typeof data.isActive === "boolean") updateData.isActive = data.isActive;
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(
        data.password,
        Number(process.env.BCRYPT_SALT_ROUNDS)
      );
    }

    const updatedUser = await this.repo.update(tenantId, userId, updateData);
    return this.sanitize(updatedUser);
  }

  // -------------------------
  // Deactivate user
  // -------------------------
  async deactivateUser(tenantId: string, userId: string): Promise<UserResponse> {
    const user = await this.repo.deactivate(tenantId, userId);
    return this.sanitize(user);
  }

  // -------------------------
// Delete user
// -------------------------
async delete(tenantId: string, userId: string): Promise<void> {
  const user = await this.repo.findById(tenantId, userId);
  if (!user) throw new NotFoundError("User not found");

  await this.repo.delete(tenantId, userId);

  logger.info(`User ${userId} deleted successfully from tenant ${tenantId}`);
}


  // -------------------------
  // Get single user
  // -------------------------
  async getUserById(tenantId: string, userId: string): Promise<UserResponse> {
    const user = await this.repo.findById(tenantId, userId);
    if (!user) throw new NotFoundError("User not found");
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
