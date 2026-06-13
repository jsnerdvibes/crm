import { prisma, User } from '../../core/db';
import { IUsersRepository, CreateUserInput, UpdateUserInput } from './users.repo.interface';
import { BaseRepository } from '../../core/base.repository';

export class UsersRepository extends BaseRepository<User, CreateUserInput, UpdateUserInput> implements IUsersRepository {
  constructor() {
    super('user');
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
