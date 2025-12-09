import { prisma, Role, User } from '../../core/db';
import { IUsersRepository } from './users.repo.interface';

export class UsersRepository implements IUsersRepository {
  // Create a new user in the tenant
  async create(
    tenantId: string,
    email: string,
    passwordHash: string,
    role: Role,
    name?: string
  ): Promise<User> {
    return prisma.user.create({
      data: {
        tenantId,
        email,
        passwordHash,
        role,
        name,
      },
    });
  }

  // Find a user by ID within the tenant
  async findById(tenantId: string, userId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
    });
  }

  // Find a user by email within the tenant
  async findByEmail(tenantId: string, email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        tenantId,
      },
    });
  }

  // Find all users in the tenant
  async findAll(tenantId: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update user fields
  async update(
    tenantId: string,
    userId: string,
    data: Partial<{
      email: string;
      passwordHash: string;
      name?: string | null;
      role: Role;
      isActive: boolean;
    }>
  ): Promise<User> {
    return prisma.user
      .updateMany({
        where: {
          id: userId,
          tenantId,
        },
        data,
      })
      .then(async () => {
        // return updated user
        const user = await this.findById(tenantId, userId);
        if (!user) throw new Error('User not found');
        return user;
      });
  }

  // Hard delete user
  async delete(tenantId: string, userId: string): Promise<void> {
    await prisma.user.deleteMany({
      where: {
        id: userId,
        tenantId,
      },
    });
  }

  // Soft deactivate user (set isActive = false)
  async deactivate(tenantId: string, userId: string): Promise<User> {
    await prisma.user.updateMany({
      where: {
        id: userId,
        tenantId,
      },
      data: {
        isActive: false,
      },
    });

    const user = await this.findById(tenantId, userId);
    if (!user) throw new Error('User not found');
    return user;
  }
}
