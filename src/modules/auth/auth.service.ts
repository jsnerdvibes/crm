import { IAuthRepository } from './auth.repo.interface';
import bcrypt from 'bcrypt';
import { RegisterDTO, RegisterResponse } from './dto';
import { BadRequestError } from '../../core/error';

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
}
