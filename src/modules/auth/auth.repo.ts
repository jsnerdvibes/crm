import { prisma, Role } from '../../core/db';
import { IAuthRepository } from './auth.repo.interface';

export const DEFAULT_SETTINGS = [
  { key: 'theme', value: 'light' },
  { key: 'timezone', value: 'UTC' },
  { key: 'notifications', value: 'enabled' },
];

export class AuthRepository implements IAuthRepository {
  async createTenant(name: string, slug: string) {
    return prisma.tenant.create({
      data: { name, slug },
    });
  }

  async createUser(
    tenantId: string,
    email: string,
    passwordHash: string,
    role: Role
  ) {
    return prisma.user.create({
      data: { tenantId, email, passwordHash, role },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createDefaultSettings(tenantId: string) {
    return prisma.setting.createMany({
      data: DEFAULT_SETTINGS.map((setting) => ({ ...setting, tenantId })),
    });
  }
}
