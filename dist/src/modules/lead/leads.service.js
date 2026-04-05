"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsService = void 0;
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
const audit_log_1 = require("../../utils/audit.log");
const logActions_1 = require("../../types/logActions");
const logger_1 = require("../../core/logger");
class LeadsService {
    constructor(repo, contactsRepo, dealsRepo) {
        this.repo = repo;
        this.contactsRepo = contactsRepo;
        this.dealsRepo = dealsRepo;
    }
    // -------------------------
    // Create a new lead
    // -------------------------
    async createLead(tenantId, data, performedById) {
        // Optional: check if title already exists in tenant
        // const existing = await this.repo.findAll(tenantId, { search: data.title });
        // if (existing.total > 0) throw new BadRequestError('Lead title already exists');
        try {
            const lead = await this.repo.create(tenantId, data);
            const sanitized = this.sanitize(lead);
            await (0, audit_log_1.logAudit)(tenantId, performedById, 'CREATE', logActions_1.LogResources.LEAD, lead.id, { title: lead.title });
            return sanitized;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new error_1.BadRequestError('Failed to create lead. Please check your input data.');
        }
    }
    // -------------------------
    // Update existing lead
    // -------------------------
    async updateLead(tenantId, leadId, data, performedById) {
        const lead = await this.repo.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        const updatedLead = await this.repo.update(tenantId, leadId, data);
        const sanitized = this.sanitize(updatedLead);
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.LEAD, lead.id, { title: lead.title });
        return sanitized;
    }
    // -------------------------
    // Delete a lead
    // -------------------------
    async deleteLead(tenantId, leadId, performedById) {
        const lead = await this.repo.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        await this.repo.delete(tenantId, leadId);
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.DELETE, logActions_1.LogResources.LEAD, lead.id, { title: lead.title });
    }
    // -------------------------
    // Get a single lead
    // -------------------------
    async getLeadById(tenantId, leadId) {
        const lead = await this.repo.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        return this.sanitize(lead);
    }
    async assignLead(tenantId, leadId, assignedToId, performedById) {
        const lead = await this.repo.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        const updated = await this.repo.assignLead(tenantId, leadId, assignedToId);
        const sanitized = this.sanitize(updated);
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.ASSIGNED, logActions_1.LogResources.LEAD, lead.id, { title: lead.title });
        return sanitized;
    }
    async getLeads(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const { leads, total } = await this.repo.getLeads(tenantId, filters);
        return {
            leads: leads.map(this.sanitize),
            page,
            limit,
            total,
        };
    }
    // -------------------------
    // Convert Lead → Contact + Deal
    // -------------------------
    async convertLead(tenantId, leadId, performedById) {
        // Fetch lead with relations
        const lead = await this.repo.findByIdWithRelations(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        if (lead.status === db_1.LeadStatus.QUALIFIED) {
            throw new error_1.BadRequestError('Lead already converted');
        }
        return db_1.prisma.$transaction(async (tx) => {
            // 1️⃣ Create or reuse contact
            const contact = lead.contactId
                ? await this.contactsRepo.findById(tenantId, lead.contactId)
                : await this.contactsRepo.createTx(tx, {
                    tenantId,
                    firstName: lead.title,
                });
            if (!contact) {
                throw new error_1.NotFoundError('Associated contact not found');
            }
            // 2️⃣ Create deal
            const deal = await this.dealsRepo.createTx(tx, {
                tenantId,
                title: lead.title,
                stage: db_1.DealStage.QUALIFICATION,
                assignedToId: lead.assignedToId ?? undefined,
                companyId: contact.companyId ?? undefined,
            });
            // 3️⃣ Update lead
            await this.repo.updateTx(tx, lead.id, {
                status: db_1.LeadStatus.QUALIFIED,
                contactId: contact.id,
            });
            // 4️⃣ Audit log
            await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.CONVERT, logActions_1.LogResources.LEAD, lead.id, {
                contactId: contact.id,
                dealId: deal.id,
            });
            return {
                leadId: lead.id,
                contactId: contact.id,
                dealId: deal.id,
            };
        });
    }
    // -------------------------
    // Helper: sanitize lead for response
    // -------------------------
    sanitize(lead) {
        return {
            id: lead.id,
            title: lead.title,
            description: lead.description ?? null,
            source: lead.source ?? null,
            status: lead.status,
            contactId: lead.contactId ?? null,
            assignedToId: lead.assignedToId ?? null,
            createdAt: lead.createdAt,
        };
    }
}
exports.LeadsService = LeadsService;
