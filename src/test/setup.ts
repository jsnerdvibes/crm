import { vi } from 'vitest'

/* -------------------------------------------------------------------------- */
/*                                CONFIG MOCK                                 */
/* -------------------------------------------------------------------------- */

vi.mock('../config', () => ({
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
}))



/* -------------------------------------------------------------------------- */
/*                                AUDIT MOCK                                 */
/* -------------------------------------------------------------------------- */

vi.mock('../utils/audit.log', () => ({
  logAudit: vi.fn().mockResolvedValue(undefined),
}))


/* -------------------------------------------------------------------------- */
/*                                LOGGER MOCK                                 */
/* -------------------------------------------------------------------------- */

vi.mock('../core/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}))

/* -------------------------------------------------------------------------- */
/*                                 DB MOCK                                    */
/* -------------------------------------------------------------------------- */

vi.mock('../core/db', () => ({
  /* ---------------- Prisma Error (Auth needs this) ---------------- */
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string
      constructor(message: string, meta: any) {
        super(message)
        this.code = meta.code
      }
    },
  },

  /* ---------------- Prisma Client (Leads needs this) ---------------- */
  prisma: {
    $transaction: vi.fn(async (cb) => cb({})),
  },

  /* ---------------- Enums used by LeadsService ---------------- */
  LeadStatus: {
    NEW: 'NEW',
    QUALIFIED: 'QUALIFIED',
  },

  DealStage: {
    QUALIFICATION: 'QUALIFICATION',
  },
}))

/* -------------------------------------------------------------------------- */
/*                               LIBRARY MOCKS                                */
/* -------------------------------------------------------------------------- */

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed-password'),
  },
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
  },
}))

vi.mock('../utils/hash', () => ({
  comparePassword: vi.fn(),
}))
