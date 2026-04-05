"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const leads_service_1 = require("../leads.service");
const error_1 = require("../../../core/error");
const db_1 = require("../../../core/db");
const audit_log_1 = require("../../../utils/audit.log");
/* -------------------------------------------------------------------------- */
/*                               REPO MOCKS                                   */
/* -------------------------------------------------------------------------- */
const leadsRepoMock = {
    create: vitest_1.vi.fn(),
    findById: vitest_1.vi.fn(),
    update: vitest_1.vi.fn(),
    delete: vitest_1.vi.fn(),
    assignLead: vitest_1.vi.fn(),
    getLeads: vitest_1.vi.fn(),
    findByIdWithRelations: vitest_1.vi.fn(),
    updateTx: vitest_1.vi.fn(),
};
const contactsRepoMock = {
    findById: vitest_1.vi.fn(),
    createTx: vitest_1.vi.fn(),
};
const dealsRepoMock = {
    createTx: vitest_1.vi.fn(),
};
let service;
const baseLead = {
    id: 'lead-1',
    title: 'Test Lead',
    description: 'desc',
    source: 'web',
    status: db_1.LeadStatus.NEW,
    contactId: null,
    assignedToId: null,
    createdAt: new Date(),
};
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
    service = new leads_service_1.LeadsService(leadsRepoMock, contactsRepoMock, dealsRepoMock);
});
/* -------------------------------------------------------------------------- */
/*                               CREATE LEAD                                  */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.createLead', () => {
    (0, vitest_1.it)('creates a lead and logs audit', async () => {
        leadsRepoMock.create.mockResolvedValue(baseLead);
        const result = await service.createLead('tenant-1', {
            title: 'Test Lead',
        });
        (0, vitest_1.expect)(leadsRepoMock.create).toHaveBeenCalled();
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
        (0, vitest_1.expect)(result.id).toBe(baseLead.id);
    });
    (0, vitest_1.it)('throws BadRequestError on failure', async () => {
        leadsRepoMock.create.mockRejectedValue(new Error('fail'));
        await (0, vitest_1.expect)(service.createLead('tenant-1', { title: 'X' })).rejects.toBeInstanceOf(error_1.BadRequestError);
    });
});
/* -------------------------------------------------------------------------- */
/*                               UPDATE LEAD                                  */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.updateLead', () => {
    (0, vitest_1.it)('updates an existing lead', async () => {
        leadsRepoMock.findById.mockResolvedValue(baseLead);
        leadsRepoMock.update.mockResolvedValue({
            ...baseLead,
            title: 'Updated',
        });
        const result = await service.updateLead('tenant-1', 'lead-1', { title: 'Updated' });
        (0, vitest_1.expect)(result.title).toBe('Updated');
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    (0, vitest_1.it)('throws NotFoundError if lead not found', async () => {
        leadsRepoMock.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.updateLead('tenant-1', 'x', {})).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
});
/* -------------------------------------------------------------------------- */
/*                               DELETE LEAD                                  */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.deleteLead', () => {
    (0, vitest_1.it)('deletes lead successfully', async () => {
        leadsRepoMock.findById.mockResolvedValue(baseLead);
        leadsRepoMock.delete.mockResolvedValue(undefined);
        await (0, vitest_1.expect)(service.deleteLead('tenant-1', 'lead-1')).resolves.not.toThrow();
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    (0, vitest_1.it)('throws NotFoundError if lead missing', async () => {
        leadsRepoMock.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.deleteLead('tenant-1', 'x')).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
});
/* -------------------------------------------------------------------------- */
/*                               GET LEAD                                     */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.getLeadById', () => {
    (0, vitest_1.it)('returns a lead', async () => {
        leadsRepoMock.findById.mockResolvedValue(baseLead);
        const result = await service.getLeadById('tenant-1', 'lead-1');
        (0, vitest_1.expect)(result.id).toBe(baseLead.id);
    });
    (0, vitest_1.it)('throws NotFoundError if not found', async () => {
        leadsRepoMock.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.getLeadById('tenant-1', 'x')).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
});
/* -------------------------------------------------------------------------- */
/*                               ASSIGN LEAD                                  */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.assignLead', () => {
    (0, vitest_1.it)('assigns a lead to user', async () => {
        leadsRepoMock.findById.mockResolvedValue(baseLead);
        leadsRepoMock.assignLead.mockResolvedValue({
            ...baseLead,
            assignedToId: 'user-1',
        });
        const result = await service.assignLead('tenant-1', 'lead-1', 'user-1');
        (0, vitest_1.expect)(result.assignedToId).toBe('user-1');
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
});
/* -------------------------------------------------------------------------- */
/*                               GET LEADS                                    */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.getLeads', () => {
    (0, vitest_1.it)('returns paginated leads', async () => {
        leadsRepoMock.getLeads.mockResolvedValue({
            leads: [baseLead],
            total: 1,
        });
        const result = await service.getLeads('tenant-1', {});
        (0, vitest_1.expect)(result.total).toBe(1);
        (0, vitest_1.expect)(result.leads.length).toBe(1);
    });
});
/* -------------------------------------------------------------------------- */
/*                               CONVERT LEAD                                 */
/* -------------------------------------------------------------------------- */
(0, vitest_1.describe)('LeadsService.convertLead', () => {
    (0, vitest_1.it)('converts lead to contact and deal', async () => {
        leadsRepoMock.findByIdWithRelations.mockResolvedValue(baseLead);
        contactsRepoMock.createTx.mockResolvedValue({
            id: 'contact-1',
            companyId: null,
        });
        dealsRepoMock.createTx.mockResolvedValue({
            id: 'deal-1',
        });
        leadsRepoMock.updateTx.mockResolvedValue(undefined);
        const result = await service.convertLead('tenant-1', 'lead-1');
        (0, vitest_1.expect)(result).toEqual({
            leadId: 'lead-1',
            contactId: 'contact-1',
            dealId: 'deal-1',
        });
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    (0, vitest_1.it)('throws error if lead already qualified', async () => {
        leadsRepoMock.findByIdWithRelations.mockResolvedValue({
            ...baseLead,
            status: db_1.LeadStatus.QUALIFIED,
        });
        await (0, vitest_1.expect)(service.convertLead('tenant-1', 'lead-1')).rejects.toBeInstanceOf(error_1.BadRequestError);
    });
    (0, vitest_1.it)('throws NotFoundError if lead missing', async () => {
        leadsRepoMock.findByIdWithRelations.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.convertLead('tenant-1', 'x')).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
});
