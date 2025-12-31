import { prisma, Setting } from '../../core/db';
import { ISettingsRepository } from './setting.repo.interface';
import { NotFoundError } from '../../core/error';

export class SettingsRepository implements ISettingsRepository {
  async getByKey(tenantId: string, key: string): Promise<Setting | null> {
    return prisma.setting.findFirst({
      where: { tenantId, key },
    });
  }

  async update(tenantId: string, key: string, value: string): Promise<Setting> {
    const updated = await prisma.setting.updateMany({
      where: { tenantId, key },
      data: { value },
    });

    if (updated.count === 0) {
      throw new NotFoundError('Setting not found');
    }

    return this.getByKey(tenantId, key) as Promise<Setting>;
  }

  async getAll(tenantId: string): Promise<Setting[]> {
    return prisma.setting.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
