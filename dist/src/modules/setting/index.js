"use strict";
// src/modules/setting/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingController = exports.settingService = exports.settingsRepository = void 0;
const setting_repo_1 = require("./setting.repo");
const setting_service_1 = require("./setting.service");
const setting_controller_1 = require("./setting.controller");
exports.settingsRepository = new setting_repo_1.SettingsRepository();
exports.settingService = new setting_service_1.SettingService(exports.settingsRepository);
exports.settingController = new setting_controller_1.SettingController(exports.settingService);
