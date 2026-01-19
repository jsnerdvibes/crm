import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LeadsService } from '../leads.service'
import { BadRequestError, NotFoundError } from '../../../core/error'
import { LeadStatus, DealStage, prisma } from '../../../core/db'
import { logAudit } from '../../../utils/audit.log'


/* -------------------------------------------------------------------------- */
/*                               REPO MOCKS                                   */
/* -------------------------------------------------------------------------- */

const leadsRepoMock = {
  create: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  assignLead: vi.fn(),
  getLeads: vi.fn(),
  findByIdWithRelations: vi.fn(),
  updateTx: vi.fn(),
}

const contactsRepoMock = {
  findById: vi.fn(),
  createTx: vi.fn(),
}

const dealsRepoMock = {
  createTx: vi.fn(),
}

let service: LeadsService

const baseLead = {
  id: 'lead-1',
  title: 'Test Lead',
  description: 'desc',
  source: 'web',
  status: LeadStatus.NEW,
  contactId: null,
  assignedToId: null,
  createdAt: new Date(),
}

beforeEach(() => {
  vi.clearAllMocks()
  service = new LeadsService(
    leadsRepoMock as any,
    contactsRepoMock as any,
    dealsRepoMock as any
  )
})

/* -------------------------------------------------------------------------- */
/*                               CREATE LEAD                                  */
/* -------------------------------------------------------------------------- */

describe('LeadsService.createLead', () => {
  it('creates a lead and logs audit', async () => {
    leadsRepoMock.create.mockResolvedValue(baseLead)

    const result = await service.createLead('tenant-1', {
      title: 'Test Lead',
    })

    expect(leadsRepoMock.create).toHaveBeenCalled()
    expect(logAudit).toHaveBeenCalled()
    expect(result.id).toBe(baseLead.id)
  })

  it('throws BadRequestError on failure', async () => {
    leadsRepoMock.create.mockRejectedValue(new Error('fail'))

    await expect(
      service.createLead('tenant-1', { title: 'X' })
    ).rejects.toBeInstanceOf(BadRequestError)
  })
})

/* -------------------------------------------------------------------------- */
/*                               UPDATE LEAD                                  */
/* -------------------------------------------------------------------------- */

describe('LeadsService.updateLead', () => {
  it('updates an existing lead', async () => {
    leadsRepoMock.findById.mockResolvedValue(baseLead)
    leadsRepoMock.update.mockResolvedValue({
      ...baseLead,
      title: 'Updated',
    })

    const result = await service.updateLead(
      'tenant-1',
      'lead-1',
      { title: 'Updated' }
    )

    expect(result.title).toBe('Updated')
    expect(logAudit).toHaveBeenCalled()
  })

  it('throws NotFoundError if lead not found', async () => {
    leadsRepoMock.findById.mockResolvedValue(null)

    await expect(
      service.updateLead('tenant-1', 'x', {})
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

/* -------------------------------------------------------------------------- */
/*                               DELETE LEAD                                  */
/* -------------------------------------------------------------------------- */

describe('LeadsService.deleteLead', () => {
  it('deletes lead successfully', async () => {
    leadsRepoMock.findById.mockResolvedValue(baseLead)
    leadsRepoMock.delete.mockResolvedValue(undefined)

    await expect(
      service.deleteLead('tenant-1', 'lead-1')
    ).resolves.not.toThrow()

    expect(logAudit).toHaveBeenCalled()
  })

  it('throws NotFoundError if lead missing', async () => {
    leadsRepoMock.findById.mockResolvedValue(null)

    await expect(
      service.deleteLead('tenant-1', 'x')
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

/* -------------------------------------------------------------------------- */
/*                               GET LEAD                                     */
/* -------------------------------------------------------------------------- */

describe('LeadsService.getLeadById', () => {
  it('returns a lead', async () => {
    leadsRepoMock.findById.mockResolvedValue(baseLead)

    const result = await service.getLeadById('tenant-1', 'lead-1')

    expect(result.id).toBe(baseLead.id)
  })

  it('throws NotFoundError if not found', async () => {
    leadsRepoMock.findById.mockResolvedValue(null)

    await expect(
      service.getLeadById('tenant-1', 'x')
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})

/* -------------------------------------------------------------------------- */
/*                               ASSIGN LEAD                                  */
/* -------------------------------------------------------------------------- */

describe('LeadsService.assignLead', () => {
  it('assigns a lead to user', async () => {
    leadsRepoMock.findById.mockResolvedValue(baseLead)
    leadsRepoMock.assignLead.mockResolvedValue({
      ...baseLead,
      assignedToId: 'user-1',
    })

    const result = await service.assignLead(
      'tenant-1',
      'lead-1',
      'user-1'
    )

    expect(result.assignedToId).toBe('user-1')
    expect(logAudit).toHaveBeenCalled()
  })
})

/* -------------------------------------------------------------------------- */
/*                               GET LEADS                                    */
/* -------------------------------------------------------------------------- */

describe('LeadsService.getLeads', () => {
  it('returns paginated leads', async () => {
    leadsRepoMock.getLeads.mockResolvedValue({
      leads: [baseLead],
      total: 1,
    })

    const result = await service.getLeads('tenant-1', {} as any)

    expect(result.total).toBe(1)
    expect(result.leads.length).toBe(1)
  })
})

/* -------------------------------------------------------------------------- */
/*                               CONVERT LEAD                                 */
/* -------------------------------------------------------------------------- */

describe('LeadsService.convertLead', () => {
  it('converts lead to contact and deal', async () => {
    leadsRepoMock.findByIdWithRelations.mockResolvedValue(baseLead)

    contactsRepoMock.createTx.mockResolvedValue({
      id: 'contact-1',
      companyId: null,
    })

    dealsRepoMock.createTx.mockResolvedValue({
      id: 'deal-1',
    })

    leadsRepoMock.updateTx.mockResolvedValue(undefined)

    const result = await service.convertLead('tenant-1', 'lead-1')

    expect(result).toEqual({
      leadId: 'lead-1',
      contactId: 'contact-1',
      dealId: 'deal-1',
    })

    expect(logAudit).toHaveBeenCalled()
  })

  it('throws error if lead already qualified', async () => {
    leadsRepoMock.findByIdWithRelations.mockResolvedValue({
      ...baseLead,
      status: LeadStatus.QUALIFIED,
    })

    await expect(
      service.convertLead('tenant-1', 'lead-1')
    ).rejects.toBeInstanceOf(BadRequestError)
  })

  it('throws NotFoundError if lead missing', async () => {
    leadsRepoMock.findByIdWithRelations.mockResolvedValue(null)

    await expect(
      service.convertLead('tenant-1', 'x')
    ).rejects.toBeInstanceOf(NotFoundError)
  })
})
