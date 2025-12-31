import { Setting } from '../../core/db';

export interface ISettingsRepository {
  getByKey(tenantId: string, key: string): Promise<Setting | null>;
  update(tenantId: string, key: string, value: string): Promise<Setting>;
  getAll(tenantId: string): Promise<Setting[]>;
}
