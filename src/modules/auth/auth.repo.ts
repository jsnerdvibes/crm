import { prisma, Role } from '../../core/db';
import { logger } from '../../core/logger';
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

  // Save refresh token
  async saveRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: { userId, token, expiresAt },
    });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findFirst({
      where: {
        token,
        expiresAt: { gte: new Date() }, // only non-expired tokens
      },
      include: {
        user: true, // <--- include the related user
      },
    });
  }

  // Revoke refresh token by id (delete)
  async revokeRefreshToken(id: string) {
    await prisma.refreshToken.delete({ where: { id } });
  }

  // Revoke refresh token by token string (delete)
  async revokeRefreshTokenByToken(token: string) {
    const result = await prisma.refreshToken.deleteMany({ where: { token } });

    return result.count;
  }
}
