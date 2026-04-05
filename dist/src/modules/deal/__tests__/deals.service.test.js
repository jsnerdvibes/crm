"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const deal_service_1 = require("../deal.service");
const db_1 = require("../../../core/db");
const error_1 = require("../../../core/error");
const audit_log_1 = require("../../../utils/audit.log");
vitest_1.vi.mock('../../../utils/audit.log', () => ({
    logAudit: vitest_1.vi.fn().mockResolvedValue(undefined),
}));
(0, vitest_1.describe)('DealsService', () => {
    let service;
    let repo;
    const tenantId = 'tenant-1';
    const userId = 'user-1';
    const deal = {
        id: 'deal-1',
        title: 'Big Deal',
        amount: 10000,
        probability: 70,
        stage: db_1.DealStage.NEW,
        companyId: 'company-1',
        assignedToId: null,
        createdAt: new Date(),
    };
    (0, vitest_1.beforeEach)(() => {
        repo = {
            create: vitest_1.vi.fn(),
            findById: vitest_1.vi.fn(),
            update: vitest_1.vi.fn(),
            delete: vitest_1.vi.fn(),
            assign: vitest_1.vi.fn(),
            updateStage: vitest_1.vi.fn(),
            getDeals: vitest_1.vi.fn(),
        };
        service = new deal_service_1.DealsService(repo);
        vitest_1.vi.clearAllMocks();
    });
    // -----------------------
    // createDeal
    // -----------------------
    (0, vitest_1.it)('creates a deal and logs audit', async () => {
        repo.create.mockResolvedValue(deal);
        const result = await service.createDeal(tenantId, { title: 'Big Deal' }, userId);
        (0, vitest_1.expect)(repo.create).toHaveBeenCalledWith(tenantId, vitest_1.expect.any(Object));
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalledWith(tenantId, userId, vitest_1.expect.any(String), vitest_1.expect.any(String), deal.id, { title: deal.title });
        (0, vitest_1.expect)(result.id).toBe(deal.id);
    });
    (0, vitest_1.it)('throws BadRequestError if create fails', async () => {
        repo.create.mockRejectedValue(new Error('fail'));
        await (0, vitest_1.expect)(service.createDeal(tenantId, { title: 'x' })).rejects.toBeInstanceOf(error_1.BadRequestError);
    });
    // -----------------------
    // updateDeal
    // -----------------------
    (0, vitest_1.it)('updates a deal', async () => {
        repo.findById.mockResolvedValue(deal);
        repo.update.mockResolvedValue({ ...deal, title: 'Updated' });
        const result = await service.updateDeal(tenantId, deal.id, { title: 'Updated' }, userId);
        (0, vitest_1.expect)(result.title).toBe('Updated');
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    (0, vitest_1.it)('throws NotFoundError if deal does not exist on update', async () => {
        repo.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.updateDeal(tenantId, 'missing', {})).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
    // -----------------------
    // deleteDeal
    // -----------------------
    (0, vitest_1.it)('deletes a deal', async () => {
        repo.findById.mockResolvedValue(deal);
        repo.delete.mockResolvedValue(undefined);
        await service.deleteDeal(tenantId, deal.id, userId);
        (0, vitest_1.expect)(repo.delete).toHaveBeenCalledWith(tenantId, deal.id);
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    (0, vitest_1.it)('throws NotFoundError if deal does not exist on delete', async () => {
        repo.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.deleteDeal(tenantId, 'missing')).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
    // -----------------------
    // getDealById
    // -----------------------
    (0, vitest_1.it)('returns a deal by id', async () => {
        repo.findById.mockResolvedValue(deal);
        const result = await service.getDealById(tenantId, deal.id);
        (0, vitest_1.expect)(result.id).toBe(deal.id);
    });
    (0, vitest_1.it)('throws NotFoundError if deal not found', async () => {
        repo.findById.mockResolvedValue(null);
        await (0, vitest_1.expect)(service.getDealById(tenantId, 'missing')).rejects.toBeInstanceOf(error_1.NotFoundError);
    });
    // -----------------------
    // assignDeal
    // -----------------------
    (0, vitest_1.it)('assigns a deal to a user', async () => {
        repo.findById.mockResolvedValue(deal);
        repo.assign.mockResolvedValue({ ...deal, assignedToId: userId });
        const result = await service.assignDeal(tenantId, deal.id, userId, userId);
        (0, vitest_1.expect)(result.assignedToId).toBe(userId);
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    // -----------------------
    // updateDealStage
    // -----------------------
    (0, vitest_1.it)('updates deal stage', async () => {
        repo.findById.mockResolvedValue(deal);
        repo.updateStage.mockResolvedValue({
            ...deal,
            stage: db_1.DealStage.WON,
        });
        const result = await service.updateDealStage(tenantId, deal.id, db_1.DealStage.WON, userId);
        (0, vitest_1.expect)(result.stage).toBe(db_1.DealStage.WON);
        (0, vitest_1.expect)(audit_log_1.logAudit).toHaveBeenCalled();
    });
    // -----------------------
    // getDeals
    // -----------------------
    (0, vitest_1.it)('returns paginated deals', async () => {
        repo.getDeals.mockResolvedValue({
            deals: [deal],
            total: 1,
        });
        const result = await service.getDeals(tenantId, { page: 1, limit: 10 });
        (0, vitest_1.expect)(result.deals).toHaveLength(1);
        (0, vitest_1.expect)(result.total).toBe(1);
        (0, vitest_1.expect)(result.page).toBe(1);
    });
});
