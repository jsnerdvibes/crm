"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadsRepository = void 0;
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
const search_1 = require("../../utils/search");
class LeadsRepository {
    // Create a new lead
    async create(tenantId, data) {
        return db_1.prisma.lead.create({
            data: {
                tenantId,
                title: data.title,
                description: data.description,
                source: data.source,
                status: data.status,
                contactId: data.contactId,
                assignedToId: data.assignedToId,
            },
        });
    }
    // Find a lead by ID within a tenant
    async findById(tenantId, leadId) {
        return db_1.prisma.lead.findFirst({
            where: {
                id: leadId,
                tenantId,
            },
        });
    }
    // Update a lead
    async update(tenantId, leadId, data) {
        await db_1.prisma.lead.updateMany({
            where: {
                id: leadId,
                tenantId,
            },
            data,
        });
        const lead = await this.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        return lead;
    }
    // Delete a lead
    async delete(tenantId, leadId) {
        await db_1.prisma.lead.deleteMany({
            where: {
                id: leadId,
                tenantId,
            },
        });
    }
    async assignLead(tenantId, leadId, assignedToId) {
        await db_1.prisma.lead.updateMany({
            where: { id: leadId, tenantId },
            data: { assignedToId },
        });
        const lead = await this.findById(tenantId, leadId);
        if (!lead)
            throw new error_1.NotFoundError('Lead not found');
        return lead;
    }
    async getLeads(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (filters.status && Object.values(db_1.LeadStatus).includes(filters.status)) {
            where.status = filters.status;
        }
        if (filters.source)
            where.source = filters.source;
        if (filters.assignedToId)
            where.assignedToId = filters.assignedToId;
        Object.assign(where, (0, search_1.buildSearchOR)(filters.search, ['title', 'description']));
        const leads = await db_1.prisma.lead.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        const total = await db_1.prisma.lead.count({ where });
        return { leads, total };
    }
    async findByIdWithRelations(tenantId, leadId) {
        return db_1.prisma.lead.findFirst({
            where: {
                id: leadId,
                tenantId,
            },
            include: {
                contact: true,
                assignedTo: true,
            },
        });
    }
    async updateTx(tx, leadId, data) {
        const lead = await tx.lead.update({
            where: {
                id: leadId,
            },
            data,
        });
        return lead;
    }
}
exports.LeadsRepository = LeadsRepository;
