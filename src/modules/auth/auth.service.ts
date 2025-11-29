import { IAuthRepository } from './auth.repo.interface';
import bcrypt from 'bcrypt';
import { LoginDTO, RegisterDTO, RegisterResponse } from './dto';
import { AppError, BadRequestError } from '../../core/error';
import { config } from '../../config';
import jwt from "jsonwebtoken";
import { comparePassword } from '../../utils/hash';

export class AuthService {
  constructor(private repo: IAuthRepository) {}

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


  async login(dto: LoginDTO) {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    const accessToken = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        tenantId: user.tenantId
      },
      config.jwt.secret,
      { expiresIn: "1h"} // short-lived
    );

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    };
  }
}
