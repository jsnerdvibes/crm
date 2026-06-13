"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const db_1 = require("../../core/db");
const base_repository_1 = require("../../core/base.repository");
class UsersRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('user');
    }
    // Find a user by email within the tenant
    async findByEmail(tenantId, email) {
        return db_1.prisma.user.findFirst({
            where: {
                email,
                tenantId,
            },
        });
    }
    // Find all users in the tenant
    async findAll(tenantId) {
        return db_1.prisma.user.findMany({
            where: {
                tenantId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    // Soft deactivate user (set isActive = false)
    async deactivate(tenantId, userId) {
        await db_1.prisma.user.updateMany({
            where: {
                id: userId,
                tenantId,
            },
            data: {
                isActive: false,
            },
        });
        const user = await this.findById(tenantId, userId);
        if (!user)
            throw new Error('User not found');
        return user;
    }
}
exports.UsersRepository = UsersRepository;
