// src/modules/auth/auth.service.ts
import { IAuthRepository } from './auth.repo.interface';
import bcrypt from 'bcrypt';
import { LoginDTO, RegisterDTO, RegisterResponse } from './dto';
import { AppError, BadRequestError } from '../../core/error';
import { config } from '../../config';
import jwt from 'jsonwebtoken';
import { comparePassword } from '../../utils/hash';
import { logger } from '../../core/logger';
export class AuthService {
  constructor(private repo: IAuthRepository) {}

  // Existing register method
  async register(data: RegisterDTO): Promise<RegisterResponse> {
    const slug = data.tenantName.toLowerCase().replace(/\s+/g, '-');

    let tenant;
    try {
      tenant = await this.repo.createTenant(data.tenantName, slug);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestError('Tenant with this name already exists');
      }
      throw error;
    }

    const passwordHash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    const admin = await this.repo.createUser(
      tenant.id,
      data.email,
      passwordHash,
      'ADMIN'
    );

    await this.repo.createDefaultSettings(tenant.id);

    return {
      message: 'Tenant + Admin created successfully',
      tenantId: tenant.id,
      adminUserId: admin.id,
    };
  }

  // Existing login method
  async login(dto: LoginDTO) {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    const accessToken = jwt.sign(
      { sub: user.id, role: user.role, tenantId: user.tenantId },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign({ sub: user.id }, config.jwt.refreshSecret, {
      expiresIn: '1h',
    });

    await this.repo.saveRefreshToken(
      user.id,
      refreshToken,
      new Date(Date.now() + parseDuration(config.jwt.expiresIn))
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string) {
    const storedToken = await this.repo.findRefreshToken(refreshToken);

    if (!storedToken)
      throw new AppError('Invalid or expired refresh token', 401);

    const user = await this.repo.findUserByEmail(storedToken.user.email);
    if (!user) throw new AppError('User not found', 404);

    // Optionally revoke the old refresh token for rotation
    await this.repo.revokeRefreshTokenByToken(storedToken.token);

    // Issue new tokens
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role, tenantId: user.tenantId },
      config.jwt.secret,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { sub: user.id },
      config.jwt.refreshSecret,
      { expiresIn: '1h' }
    );
    await this.repo.saveRefreshToken(
      user.id,
      newRefreshToken,
      new Date(Date.now() + parseDuration(config.jwt.expiresIn))
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    logger.info(`Token from service ${refreshToken}`);
    const deletedCount =
      await this.repo.revokeRefreshTokenByToken(refreshToken);

    if (deletedCount === 0) {
      throw new AppError('Invalid refresh token', 400);
    }

    logger.info(`Refresh token revoked successfully`);
  }
}

// Helper to convert string duration to ms
function parseDuration(duration: string) {
  // e.g., '15m' => 15 * 60 * 1000
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const value = parseInt(match[1]);
  switch (match[2]) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}
