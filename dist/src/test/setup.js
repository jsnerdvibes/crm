"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
/* -------------------------------------------------------------------------- */
/*                                CONFIG MOCK                                 */
/* -------------------------------------------------------------------------- */
vitest_1.vi.mock('../config', () => ({
    config: {
        app: {
            env: 'test',
        },
        bcrypt: {
            saltRounds: 10,
        },
        jwt: {
            secret: 'jwt-secret',
            refreshSecret: 'jwt-refresh-secret',
            expiresIn: '1h',
        },
    },
}));
/* -------------------------------------------------------------------------- */
/*                                AUDIT MOCK                                 */
/* -------------------------------------------------------------------------- */
vitest_1.vi.mock('../utils/audit.log', () => ({
    logAudit: vitest_1.vi.fn().mockResolvedValue(undefined),
}));
/* -------------------------------------------------------------------------- */
/*                                LOGGER MOCK                                 */
/* -------------------------------------------------------------------------- */
vitest_1.vi.mock('../core/logger', () => ({
    logger: {
        info: vitest_1.vi.fn(),
        error: vitest_1.vi.fn(),
        warn: vitest_1.vi.fn(),
        debug: vitest_1.vi.fn(),
    },
}));
/* -------------------------------------------------------------------------- */
/*                                 DB MOCK                                    */
/* -------------------------------------------------------------------------- */
vitest_1.vi.mock('../core/db', () => ({
    /* ---------------- Prisma Error (Auth needs this) ---------------- */
    Prisma: {
        PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
            constructor(message, meta) {
                super(message);
                this.code = meta.code;
            }
        },
    },
    /* ---------------- Prisma Client (Leads needs this) ---------------- */
    prisma: {
        $transaction: vitest_1.vi.fn(async (cb) => cb({})),
    },
    /* ---------------- Enums used by LeadsService ---------------- */
    LeadStatus: {
        NEW: 'NEW',
        QUALIFIED: 'QUALIFIED',
    },
    DealStage: {
        QUALIFICATION: 'QUALIFICATION',
    },
}));
/* -------------------------------------------------------------------------- */
/*                               LIBRARY MOCKS                                */
/* -------------------------------------------------------------------------- */
vitest_1.vi.mock('bcrypt', () => ({
    default: {
        hash: vitest_1.vi.fn().mockResolvedValue('hashed-password'),
    },
}));
vitest_1.vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vitest_1.vi.fn().mockReturnValue('mock-jwt-token'),
    },
}));
vitest_1.vi.mock('../utils/hash', () => ({
    comparePassword: vitest_1.vi.fn(),
}));
