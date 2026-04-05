"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const auth_service_1 = require("../auth.service");
const error_1 = require("../../../core/error");
const db_1 = require("../../../core/db");
const hash_1 = require("../../../utils/hash");
/* -------------------------------------------------------------------------- */
/*                               REPO MOCK                                    */
/* -------------------------------------------------------------------------- */
const repoMock = {
    createTenant: vitest_1.vi.fn(),
    createUser: vitest_1.vi.fn(),
    createDefaultSettings: vitest_1.vi.fn(),
    findUserByEmail: vitest_1.vi.fn(),
    saveRefreshToken: vitest_1.vi.fn(),
    findRefreshToken: vitest_1.vi.fn(),
    revokeRefreshTokenByToken: vitest_1.vi.fn(),
};
let service;
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
    service = new auth_service_1.AuthService(repoMock);
});
/* -------------------------------------------------------------------------- */
/*                               REGISTER TESTS                                */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('AuthService.register', () => {
    (0, vitest_1.it)('creates tenant, admin user and default settings', async () => {
        repoMock.createTenant.mockResolvedValue({ id: 'tenant-1' });
        repoMock.createUser.mockResolvedValue({ id: 'user-1' });
        repoMock.createDefaultSettings.mockResolvedValue(undefined);
        const result = await service.register({
            tenantName: 'Acme Corp',
            email: 'admin@acme.com',
            password: 'password123',
        });
        (0, vitest_1.expect)(repoMock.createTenant).toHaveBeenCalledWith('Acme Corp', 'acme-corp');
        (0, vitest_1.expect)(repoMock.createUser).toHaveBeenCalledWith('tenant-1', 'admin@acme.com', 'hashed-password', 'ADMIN');
        (0, vitest_1.expect)(repoMock.createDefaultSettings).toHaveBeenCalledWith('tenant-1');
        (0, vitest_1.expect)(result).toEqual({
            message: 'Tenant + Admin created successfully',
            tenantId: 'tenant-1',
            adminUserId: 'user-1',
        });
    });
    (0, vitest_1.it)('throws BadRequestError when tenant already exists', async () => {
        const prismaError = new db_1.Prisma.PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: '5.0.0' });
        repoMock.createTenant.mockRejectedValue(prismaError);
        await (0, vitest_1.expect)(service.register({
            tenantName: 'Acme Corp',
            email: 'admin@acme.com',
            password: 'password123',
        })).rejects.toBeInstanceOf(error_1.BadRequestError);
    });
});
/* -------------------------------------------------------------------------- */
/*                                 LOGIN TESTS                                 */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('AuthService.login', () => {
    (0, vitest_1.it)('throws error if user not found', async () => {
        repoMock.findUserByEmail.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.login({ email: 'x@y.com', password: '123' })).rejects.toBeInstanceOf(error_1.AppError);
    });
    (0, vitest_1.it)('throws error if password is invalid', async () => {
        repoMock.findUserByEmail.mockResolvedValue({
            id: 'u1',
            email: 'x@y.com',
            passwordHash: 'hash',
            role: 'ADMIN',
            tenantId: 't1',
        });
        hash_1.comparePassword.mockResolvedValue(false);
        await (0, vitest_1.expect)(service.login({ email: 'x@y.com', password: 'wrong' })).rejects.toBeInstanceOf(error_1.AppError);
    });
    (0, vitest_1.it)('returns tokens and user data on successful login', async () => {
        repoMock.findUserByEmail.mockResolvedValue({
            id: 'u1',
            email: 'x@y.com',
            passwordHash: 'hash',
            role: 'ADMIN',
            tenantId: 't1',
        });
        hash_1.comparePassword.mockResolvedValue(true);
        repoMock.saveRefreshToken.mockResolvedValue(undefined);
        const result = await service.login({
            email: 'x@y.com',
            password: 'password',
        });
        (0, vitest_1.expect)(result.accessToken).toBeDefined();
        (0, vitest_1.expect)(result.refreshToken).toBeDefined();
        (0, vitest_1.expect)(result.user).toEqual({
            id: 'u1',
            email: 'x@y.com',
            role: 'ADMIN',
            tenantId: 't1',
        });
    });
});
/* -------------------------------------------------------------------------- */
/*                          REFRESH TOKEN TESTS                                */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('AuthService.refreshAccessToken', () => {
    (0, vitest_1.it)('issues new access and refresh tokens', async () => {
        repoMock.findRefreshToken.mockResolvedValue({
            token: 'old-token',
            user: { email: 'x@y.com' },
        });
        repoMock.findUserByEmail.mockResolvedValue({
            id: 'u1',
            email: 'x@y.com',
            role: 'ADMIN',
            tenantId: 't1',
        });
        repoMock.revokeRefreshTokenByToken.mockResolvedValue(1);
        repoMock.saveRefreshToken.mockResolvedValue(undefined);
        const result = await service.refreshAccessToken('old-token');
        (0, vitest_1.expect)(result.accessToken).toBeDefined();
        (0, vitest_1.expect)(result.refreshToken).toBeDefined();
    });
    (0, vitest_1.it)('throws error if refresh token is invalid', async () => {
        repoMock.findRefreshToken.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.refreshAccessToken('invalid-token')).rejects.toBeInstanceOf(error_1.AppError);
    });
});
/* -------------------------------------------------------------------------- */
/*                                  LOGOUT TESTS                               */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('AuthService.logout', () => {
    (0, vitest_1.it)('revokes refresh token successfully', async () => {
        repoMock.revokeRefreshTokenByToken.mockResolvedValue(1);
        await (0, vitest_1.expect)(service.logout('token')).resolves.not.toThrow();
    });
    (0, vitest_1.it)('throws error if token is invalid', async () => {
        repoMock.revokeRefreshTokenByToken.mockResolvedValue(0);
        await (0, vitest_1.expect)(service.logout('invalid-token')).rejects.toBeInstanceOf(error_1.AppError);
    });
});
