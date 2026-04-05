"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const db_1 = require("../../core/db");
class UsersRepository {
    // Create a new user in the tenant
    async create(tenantId, email, passwordHash, role, name) {
        return db_1.prisma.user.create({
            data: {
                tenantId,
                email,
                passwordHash,
                role,
                name,
            },
        });
    }
    // Find a user by ID within the tenant
    async findById(tenantId, userId) {
        return db_1.prisma.user.findFirst({
            where: {
                id: userId,
                tenantId,
            },
        });
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
    // Update user fields
    async update(tenantId, userId, data) {
        return db_1.prisma.user
            .updateMany({
            where: {
                id: userId,
                tenantId,
            },
            data,
        })
            .then(async () => {
            // return updated user
            const user = await this.findById(tenantId, userId);
            if (!user)
                throw new Error('User not found');
            return user;
        });
    }
    // Hard delete user
    async delete(tenantId, userId) {
        await db_1.prisma.user.deleteMany({
            where: {
                id: userId,
                tenantId,
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
