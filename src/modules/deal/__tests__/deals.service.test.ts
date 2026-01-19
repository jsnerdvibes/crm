import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DealsService } from '../deal.service'
import { IDealsRepository } from '../deal.repo.interface'
import { DealStage } from '../../../core/db'
import { BadRequestError, NotFoundError } from '../../../core/error'
import { logAudit } from '../../../utils/audit.log'

vi.mock('../../../utils/audit.log', () => ({
  logAudit: vi.fn().mockResolvedValue(undefined),
}))

describe('DealsService', () => {
  let service: DealsService
  let repo: vi.Mocked<IDealsRepository>

  const tenantId = 'tenant-1'
  const userId = 'user-1'

  const deal = {
    id: 'deal-1',
    title: 'Big Deal',
    amount: 10000,
    probability: 70,
    stage: DealStage.NEW,
    companyId: 'company-1',
    assignedToId: null,
    createdAt: new Date(),
  }

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      assign: vi.fn(),
      updateStage: vi.fn(),
      getDeals: vi.fn(),
    } as any

    service = new DealsService(repo)
    vi.clearAllMocks()
  })

  // -----------------------
  // createDeal
  // -----------------------
  it('creates a deal and logs audit', async () => {
    repo.create.mockResolvedValue(deal)

    const result = await service.createDeal(
      tenantId,
      { title: 'Big Deal' } as any,
      userId
    )

    expect(repo.create).toHaveBeenCalledWith(tenantId, expect.any(Object))
    expect(logAudit).toHaveBeenCalledWith(
      tenantId,
      userId,
      expect.any(String),
      expect.any(String),
      deal.id,
      { title: deal.title }
    )
    expect(result.id).toBe(deal.id)
  })

  it('throws BadRequestError if create fails', async () => {
    repo.create.mockRejectedValue(new Error('fail'))

    await expect(
      service.createDeal(tenantId, { title: 'x' } as any)
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  // -----------------------
  // updateDeal
  // -----------------------
  it('updates a deal', async () => {
    repo.findById.mockResolvedValue(deal)
    repo.update.mockResolvedValue({ ...deal, title: 'Updated' })

    const result = await service.updateDeal(
      tenantId,
      deal.id,
      { title: 'Updated' },
      userId
    )

    expect(result.title).toBe('Updated')
    expect(logAudit).toHaveBeenCalled()
  })

  it('throws NotFoundError if deal does not exist on update', async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      service.updateDeal(tenantId, 'missing', {} as any)
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  // -----------------------
  // deleteDeal
  // -----------------------
  it('deletes a deal', async () => {
    repo.findById.mockResolvedValue(deal)
    repo.delete.mockResolvedValue(undefined)

    await service.deleteDeal(tenantId, deal.id, userId)

    expect(repo.delete).toHaveBeenCalledWith(tenantId, deal.id)
    expect(logAudit).toHaveBeenCalled()
  })

  it('throws NotFoundError if deal does not exist on delete', async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      service.deleteDeal(tenantId, 'missing')
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  // -----------------------
  // getDealById
  // -----------------------
  it('returns a deal by id', async () => {
    repo.findById.mockResolvedValue(deal)

    const result = await service.getDealById(tenantId, deal.id)

    expect(result.id).toBe(deal.id)
  })

  it('throws NotFoundError if deal not found', async () => {
    repo.findById.mockResolvedValue(null)

    await expect(
      service.getDealById(tenantId, 'missing')
    ).rejects.toBeInstanceOf(NotFoundError)
  })

  // -----------------------
  // assignDeal
  // -----------------------
  it('assigns a deal to a user', async () => {
    repo.findById.mockResolvedValue(deal)
    repo.assign.mockResolvedValue({ ...deal, assignedToId: userId })

    const result = await service.assignDeal(
      tenantId,
      deal.id,
      userId,
      userId
    )

    expect(result.assignedToId).toBe(userId)
    expect(logAudit).toHaveBeenCalled()
  })

  // -----------------------
  // updateDealStage
  // -----------------------
  it('updates deal stage', async () => {
    repo.findById.mockResolvedValue(deal)
    repo.updateStage.mockResolvedValue({
      ...deal,
      stage: DealStage.WON,
    })

    const result = await service.updateDealStage(
      tenantId,
      deal.id,
      DealStage.WON,
      userId
    )

    expect(result.stage).toBe(DealStage.WON)
    expect(logAudit).toHaveBeenCalled()
  })

  // -----------------------
  // getDeals
  // -----------------------
  it('returns paginated deals', async () => {
    repo.getDeals.mockResolvedValue({
      deals: [deal],
      total: 1,
    })

    const result = await service.getDeals(tenantId, { page: 1, limit: 10 })

    expect(result.deals).toHaveLength(1)
    expect(result.total).toBe(1)
    expect(result.page).toBe(1)
  })
})
