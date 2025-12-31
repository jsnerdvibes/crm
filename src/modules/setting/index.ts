// src/modules/setting/index.ts

import { SettingsRepository } from './setting.repo';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';

export const settingsRepository = new SettingsRepository();
export const settingService = new SettingService(settingsRepository);
export const settingController = new SettingController(settingService);
