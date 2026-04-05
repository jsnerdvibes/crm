"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
class SettingsRepository {
    async getByKey(tenantId, key) {
        return db_1.prisma.setting.findFirst({
            where: { tenantId, key },
        });
    }
    async update(tenantId, key, value) {
        const updated = await db_1.prisma.setting.updateMany({
            where: { tenantId, key },
            data: { value },
        });
        if (updated.count === 0) {
            throw new error_1.NotFoundError('Setting not found');
        }
        return this.getByKey(tenantId, key);
    }
    async getAll(tenantId) {
        return db_1.prisma.setting.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.SettingsRepository = SettingsRepository;
