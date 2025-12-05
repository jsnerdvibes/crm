"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
const logger_1 = require("../../core/logger");
const config_1 = require("../../config");
class UsersService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------
    // Create a new user
    // -------------------------
    async createUser(tenantId, data) {
        // check if email already exists
        const existing = await this.repo.findByEmail(tenantId, data.email);
        if (existing) {
            throw new error_1.BadRequestError('Email already exists');
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, Number(config_1.config.bcrypt.saltRounds));
        const user = await this.repo.create(tenantId, data.email, passwordHash, data.role, data.name);
        return this.sanitize(user);
    }
    // -------------------------
    // Update existing user
    // -------------------------
    async updateUser(tenantId, userId, data) {
        const user = await this.repo.findById(tenantId, userId);
        if (!user)
            throw new error_1.NotFoundError('User not found');
        const updateData = {};
        if (data.email)
            updateData.email = data.email;
        if (data.name)
            updateData.name = data.name;
        if (data.role)
            updateData.role = data.role;
        if (typeof data.isActive === 'boolean')
            updateData.isActive = data.isActive;
        if (data.password) {
            updateData.passwordHash = await bcrypt_1.default.hash(data.password, Number(config_1.config.bcrypt.saltRounds));
        }
        const updatedUser = await this.repo.update(tenantId, userId, updateData);
        return this.sanitize(updatedUser);
    }
    // -------------------------
    // Deactivate user
    // -------------------------
    async deactivateUser(tenantId, userId) {
        const userInfo = await this.repo.findById(tenantId, userId);
        if (!userInfo)
            throw new error_1.NotFoundError('User not found');
        if (userInfo.role === db_1.Role.ADMIN || userInfo.role === db_1.Role.SUPER_ADMIN) {
            throw new error_1.ForbiddenError('Admin users cannot be deleted');
        }
        const user = await this.repo.deactivate(tenantId, userId);
        return this.sanitize(user);
    }
    // -------------------------
    // Delete user
    // -------------------------
    async delete(tenantId, userId) {
        const user = await this.repo.findById(tenantId, userId);
        if (!user)
            throw new error_1.NotFoundError('User not found');
        if (user.role === db_1.Role.ADMIN || user.role === db_1.Role.SUPER_ADMIN) {
            throw new error_1.ForbiddenError('Admin users cannot be deleted');
        }
        await this.repo.delete(tenantId, userId);
        logger_1.logger.info(`User ${userId} deleted successfully from tenant ${tenantId}`);
    }
    // -------------------------
    // Get single user
    // -------------------------
    async getUserById(tenantId, userId) {
        const user = await this.repo.findById(tenantId, userId);
        if (!user)
            throw new error_1.NotFoundError('User not found');
        return this.sanitize(user);
    }
    // -------------------------
    // Get all users in tenant
    // -------------------------
    async getAllUsers(tenantId) {
        const users = await this.repo.findAll(tenantId);
        return users.map(this.sanitize);
    }
    // -------------------------
    // Helper: sanitize user for response
    // -------------------------
    sanitize(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name ?? null,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
exports.UsersService = UsersService;
