"use strict";
// src/modules/setting/setting.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingService = void 0;
class SettingService {
    constructor(repo) {
        this.repo = repo;
    }
    getByKey(tenantId, key) {
        return this.repo.getByKey(tenantId, key);
    }
    update(tenantId, key, value) {
        return this.repo.update(tenantId, key, value);
    }
    getAll(tenantId) {
        return this.repo.getAll(tenantId);
    }
}
exports.SettingService = SettingService;
