"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../../core/error");
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_1 = require("../../utils/hash");
const logger_1 = require("../../core/logger");
class AuthService {
    constructor(repo) {
        this.repo = repo;
    }
    // Existing register method
    async register(data) {
        const slug = data.tenantName.toLowerCase().replace(/\s+/g, '-');
        let tenant;
        try {
            tenant = await this.repo.createTenant(data.tenantName, slug);
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new error_1.BadRequestError('Tenant with this name already exists');
            }
            throw error;
        }
        const passwordHash = await bcrypt_1.default.hash(data.password, Number(config_1.config.bcrypt.saltRounds));
        const admin = await this.repo.createUser(tenant.id, data.email, passwordHash, 'ADMIN');
        await this.repo.createDefaultSettings(tenant.id);
        return {
            message: 'Tenant + Admin created successfully',
            tenantId: tenant.id,
            adminUserId: admin.id,
        };
    }
    // Existing login method
    async login(dto) {
        const user = await this.repo.findUserByEmail(dto.email);
        if (!user)
            throw new error_1.AppError('Invalid credentials', 401);
        const isValid = await (0, hash_1.comparePassword)(dto.password, user.passwordHash);
        if (!isValid)
            throw new error_1.AppError('Invalid credentials', 401);
        const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role, tenantId: user.tenantId }, config_1.config.jwt.secret, { expiresIn: '1h' });
        // Generate refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, config_1.config.jwt.refreshSecret, {
            expiresIn: '1h',
        });
        await this.repo.saveRefreshToken(user.id, refreshToken, new Date(Date.now() + parseDuration(config_1.config.jwt.expiresIn)));
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
        };
    }
    // Refresh access token using refresh token
    async refreshAccessToken(refreshToken) {
        const storedToken = await this.repo.findRefreshToken(refreshToken);
        if (!storedToken)
            throw new error_1.AppError('Invalid or expired refresh token', 401);
        const user = await this.repo.findUserByEmail(storedToken.user.email);
        if (!user)
            throw new error_1.AppError('User not found', 404);
        // Optionally revoke the old refresh token for rotation
        await this.repo.revokeRefreshTokenByToken(storedToken.token);
        // Issue new tokens
        const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role, tenantId: user.tenantId }, config_1.config.jwt.secret, { expiresIn: '1h' });
        const newRefreshToken = jsonwebtoken_1.default.sign({ sub: user.id }, config_1.config.jwt.refreshSecret, { expiresIn: '1h' });
        await this.repo.saveRefreshToken(user.id, newRefreshToken, new Date(Date.now() + parseDuration(config_1.config.jwt.expiresIn)));
        return { accessToken, refreshToken: newRefreshToken };
    }
    async logout(refreshToken) {
        logger_1.logger.info(`Token from service ${refreshToken}`);
        const deletedCount = await this.repo.revokeRefreshTokenByToken(refreshToken);
        if (deletedCount === 0) {
            throw new error_1.AppError('Invalid refresh token', 400);
        }
        logger_1.logger.info(`Refresh token revoked successfully`);
    }
}
exports.AuthService = AuthService;
// Helper to convert string duration to ms
function parseDuration(duration) {
    // e.g., '15m' => 15 * 60 * 1000
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match)
        return 0;
    const value = parseInt(match[1]);
    switch (match[2]) {
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
}
