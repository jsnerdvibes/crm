"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsService = void 0;
const error_1 = require("../../core/error");
const audit_log_1 = require("../../utils/audit.log");
const logActions_1 = require("../../types/logActions");
const logger_1 = require("../../core/logger");
class DealsService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------------------
    // Create a new deal
    // -------------------------------------
    async createDeal(tenantId, data, performedById) {
        try {
            const deal = await this.repo.create(tenantId, data);
            const sanitized = this.sanitize(deal);
            // log audit
            await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.CREATE, logActions_1.LogResources.DEAL, deal.id, { title: deal.title });
            return sanitized;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new error_1.BadRequestError('Failed to create deal. Please check your input data.');
        }
    }
    // -------------------------------------
    // Update deal
    // -------------------------------------
    async updateDeal(tenantId, dealId, data, performedById) {
        const deal = await this.repo.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        const updated = await this.repo.update(tenantId, dealId, data);
        const sanitized = this.sanitize(updated);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.DEAL, updated.id, { title: updated.title });
        return sanitized;
    }
    // -------------------------------------
    // Delete deal
    // -------------------------------------
    async deleteDeal(tenantId, dealId, performedById) {
        const deal = await this.repo.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        await this.repo.delete(tenantId, dealId);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.DELETE, logActions_1.LogResources.DEAL, dealId, { title: deal.title });
    }
    // -------------------------------------
    // Get single deal by ID
    // -------------------------------------
    async getDealById(tenantId, dealId) {
        const deal = await this.repo.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        return this.sanitize(deal);
    }
    // -------------------------------------
    // Assign deal to user
    // -------------------------------------
    async assignDeal(tenantId, dealId, assignedToId, performedById) {
        const deal = await this.repo.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        const updated = await this.repo.assign(tenantId, dealId, assignedToId);
        const sanitized = this.sanitize(updated);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.ASSIGNED, logActions_1.LogResources.DEAL, updated.id, { title: updated.title });
        return sanitized;
    }
    // -------------------------------------
    // Update Deal Stage (Workflow)
    // -------------------------------------
    async updateDealStage(tenantId, dealId, stage, performedById) {
        const deal = await this.repo.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        const updated = await this.repo.updateStage(tenantId, dealId, stage);
        const sanitized = this.sanitize(updated);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE_STAGE, logActions_1.LogResources.DEAL, updated.id, { title: updated.title });
        return sanitized;
    }
    // -------------------------------------
    // List deals with filters & pagination
    // -------------------------------------
    async getDeals(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const { deals, total } = await this.repo.getDeals(tenantId, filters);
        return {
            deals: deals.map(this.sanitize),
            page,
            limit,
            total,
        };
    }
    // -------------------------------------
    // Helper: sanitize deal output
    // -------------------------------------
    sanitize(deal) {
        return {
            id: deal.id,
            title: deal.title,
            amount: deal.amount ?? null,
            probability: deal.probability ?? null,
            stage: deal.stage,
            companyId: deal.companyId ?? null,
            assignedToId: deal.assignedToId ?? null,
            createdAt: deal.createdAt,
        };
    }
}
exports.DealsService = DealsService;
