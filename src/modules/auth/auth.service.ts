import { IAuthRepository } from './auth.repo.interface';
import bcrypt from 'bcrypt';

export class AuthService {
  constructor(private repo: IAuthRepository) {}

  async register(data: {
    tenantName: string;
    email: string;
    password: string;
  }) {
    const slug = data.tenantName.toLowerCase().replace(/\s+/g, '-');

    // Create tenant
    const tenant = await this.repo.createTenant(data.tenantName, slug);

    // Hash password
    const passwordHash = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    // Create admin user
    const admin = await this.repo.createUser(
      tenant.id,
      data.email,
      passwordHash,
      'ADMIN'
    );

    // Create default settings
    await this.repo.createDefaultSettings(tenant.id);

    // Return success
    return {
      message: 'Tenant + Admin created successfully',
      tenantId: tenant.id,
      adminUserId: admin.id,
    };
  }
}
