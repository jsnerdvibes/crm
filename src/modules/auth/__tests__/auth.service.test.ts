import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthService } from '../auth.service'
import { AppError, BadRequestError } from '../../../core/error'
import { Prisma } from '../../../core/db'
import { comparePassword } from '../../../utils/hash'


/* -------------------------------------------------------------------------- */
/*                               REPO MOCK                                    */
/* -------------------------------------------------------------------------- */

const repoMock = {
  createTenant: vi.fn(),
  createUser: vi.fn(),
  createDefaultSettings: vi.fn(),
  findUserByEmail: vi.fn(),
  saveRefreshToken: vi.fn(),
  findRefreshToken: vi.fn(),
  revokeRefreshTokenByToken: vi.fn(),
}

let service: AuthService

beforeEach(() => {
  vi.clearAllMocks()
  service = new AuthService(repoMock as any)
})

/* -------------------------------------------------------------------------- */
/*                               REGISTER TESTS                                */
/* -------------------------------------------------------------------------- */

describe('AuthService.register', () => {
  it('creates tenant, admin user and default settings', async () => {
    repoMock.createTenant.mockResolvedValue({ id: 'tenant-1' })
    repoMock.createUser.mockResolvedValue({ id: 'user-1' })
    repoMock.createDefaultSettings.mockResolvedValue(undefined)

    const result = await service.register({
      tenantName: 'Acme Corp',
      email: 'admin@acme.com',
      password: 'password123',
    })

    expect(repoMock.createTenant).toHaveBeenCalledWith(
      'Acme Corp',
      'acme-corp'
    )

    expect(repoMock.createUser).toHaveBeenCalledWith(
      'tenant-1',
      'admin@acme.com',
      'hashed-password',
      'ADMIN'
    )

    expect(repoMock.createDefaultSettings).toHaveBeenCalledWith('tenant-1')

    expect(result).toEqual({
      message: 'Tenant + Admin created successfully',
      tenantId: 'tenant-1',
      adminUserId: 'user-1',
    })
  })

  it('throws BadRequestError when tenant already exists', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      { code: 'P2002', clientVersion: '5.0.0' }
    )

    repoMock.createTenant.mockRejectedValue(prismaError)

    await expect(
      service.register({
        tenantName: 'Acme Corp',
        email: 'admin@acme.com',
        password: 'password123',
      })
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})

/* -------------------------------------------------------------------------- */
/*                                 LOGIN TESTS                                 */
/* -------------------------------------------------------------------------- */

describe('AuthService.login', () => {
  it('throws error if user not found', async () => {
    repoMock.findUserByEmail.mockResolvedValue(null)

    await expect(
      service.login({ email: 'x@y.com', password: '123' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('throws error if password is invalid', async () => {
    repoMock.findUserByEmail.mockResolvedValue({
      id: 'u1',
      email: 'x@y.com',
      passwordHash: 'hash',
      role: 'ADMIN',
      tenantId: 't1',
    })

    ;(comparePassword as any).mockResolvedValue(false)

    await expect(
      service.login({ email: 'x@y.com', password: 'wrong' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('returns tokens and user data on successful login', async () => {
    repoMock.findUserByEmail.mockResolvedValue({
      id: 'u1',
      email: 'x@y.com',
      passwordHash: 'hash',
      role: 'ADMIN',
      tenantId: 't1',
    })

    ;(comparePassword as any).mockResolvedValue(true)
    repoMock.saveRefreshToken.mockResolvedValue(undefined)

    const result = await service.login({
      email: 'x@y.com',
      password: 'password',
    })

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
    expect(result.user).toEqual({
      id: 'u1',
      email: 'x@y.com',
      role: 'ADMIN',
      tenantId: 't1',
    })
  })
})

/* -------------------------------------------------------------------------- */
/*                          REFRESH TOKEN TESTS                                */
/* -------------------------------------------------------------------------- */

describe('AuthService.refreshAccessToken', () => {
  it('issues new access and refresh tokens', async () => {
    repoMock.findRefreshToken.mockResolvedValue({
      token: 'old-token',
      user: { email: 'x@y.com' },
    })

    repoMock.findUserByEmail.mockResolvedValue({
      id: 'u1',
      email: 'x@y.com',
      role: 'ADMIN',
      tenantId: 't1',
    })

    repoMock.revokeRefreshTokenByToken.mockResolvedValue(1)
    repoMock.saveRefreshToken.mockResolvedValue(undefined)

    const result = await service.refreshAccessToken('old-token')

    expect(result.accessToken).toBeDefined()
    expect(result.refreshToken).toBeDefined()
  })

  it('throws error if refresh token is invalid', async () => {
    repoMock.findRefreshToken.mockResolvedValue(null)

    await expect(
      service.refreshAccessToken('invalid-token')
    ).rejects.toBeInstanceOf(AppError)
  })
})

/* -------------------------------------------------------------------------- */
/*                                  LOGOUT TESTS                               */
/* -------------------------------------------------------------------------- */

describe('AuthService.logout', () => {
  it('revokes refresh token successfully', async () => {
    repoMock.revokeRefreshTokenByToken.mockResolvedValue(1)

    await expect(service.logout('token')).resolves.not.toThrow()
  })

  it('throws error if token is invalid', async () => {
    repoMock.revokeRefreshTokenByToken.mockResolvedValue(0)

    await expect(service.logout('invalid-token')).rejects.toBeInstanceOf(
      AppError
    )
  })
})
