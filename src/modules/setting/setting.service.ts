// src/modules/setting/setting.service.ts

import { ISettingsRepository } from './setting.repo.interface';
import { Setting } from '../../core/db';

export class SettingService {
  constructor(private repo: ISettingsRepository) {}

  getByKey(tenantId: string, key: string): Promise<Setting | null> {
    return this.repo.getByKey(tenantId, key);
  }

  update(tenantId: string, key: string, value: string): Promise<Setting> {
    return this.repo.update(tenantId, key, value);
  }

  getAll(tenantId: string): Promise<Setting[]> {
    return this.repo.getAll(tenantId);
  }
}
