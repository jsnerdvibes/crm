"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = exports.DEFAULT_SETTINGS = void 0;
const db_1 = require("../../core/db");
exports.DEFAULT_SETTINGS = [
    { key: 'theme', value: 'light' },
    { key: 'timezone', value: 'UTC' },
    { key: 'notifications', value: 'enabled' },
];
class AuthRepository {
    async createTenant(name, slug) {
        return db_1.prisma.tenant.create({
            data: { name, slug },
        });
    }
    async createUser(tenantId, email, passwordHash, role) {
        return db_1.prisma.user.create({
            data: { tenantId, email, passwordHash, role },
        });
    }
    async findUserByEmail(email) {
        return db_1.prisma.user.findUnique({
            where: { email },
        });
    }
    async createDefaultSettings(tenantId) {
        return db_1.prisma.setting.createMany({
            data: exports.DEFAULT_SETTINGS.map((setting) => ({ ...setting, tenantId })),
        });
    }
    // Save refresh token
    async saveRefreshToken(userId, token, expiresAt) {
        return db_1.prisma.refreshToken.create({
            data: { userId, token, expiresAt },
        });
    }
    async findRefreshToken(token) {
        return db_1.prisma.refreshToken.findFirst({
            where: {
                token,
                expiresAt: { gte: new Date() }, // only non-expired tokens
            },
            include: {
                user: true, // <--- include the related user
            },
        });
    }
    // Revoke refresh token by id (delete)
    async revokeRefreshToken(id) {
        await db_1.prisma.refreshToken.delete({ where: { id } });
    }
    // Revoke refresh token by token string (delete)
    async revokeRefreshTokenByToken(token) {
        const result = await db_1.prisma.refreshToken.deleteMany({ where: { token } });
        return result.count;
    }
}
exports.AuthRepository = AuthRepository;
