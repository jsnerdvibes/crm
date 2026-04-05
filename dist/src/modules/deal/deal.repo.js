"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsRepository = void 0;
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
const search_1 = require("../../utils/search");
class DealsRepository {
    async create(tenantId, data) {
        return db_1.prisma.deal.create({
            data: {
                tenantId,
                title: data.title,
                amount: data.amount,
                probability: data.probability,
                stage: data.stage,
                companyId: data.companyId,
                assignedToId: data.assignedToId,
            },
        });
    }
    async findById(tenantId, dealId) {
        return db_1.prisma.deal.findFirst({
            where: { id: dealId, tenantId },
        });
    }
    async findAll(tenantId) {
        return db_1.prisma.deal.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(tenantId, dealId, data) {
        await db_1.prisma.deal.updateMany({
            where: { id: dealId, tenantId },
            data,
        });
        const deal = await this.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        return deal;
    }
    async delete(tenantId, dealId) {
        await db_1.prisma.deal.deleteMany({
            where: { id: dealId, tenantId },
        });
    }
    async assign(tenantId, dealId, assignedToId) {
        await db_1.prisma.deal.updateMany({
            where: { id: dealId, tenantId },
            data: { assignedToId },
        });
        const deal = await this.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        return deal;
    }
    async updateStage(tenantId, dealId, stage) {
        await db_1.prisma.deal.updateMany({
            where: { id: dealId, tenantId },
            data: { stage },
        });
        const deal = await this.findById(tenantId, dealId);
        if (!deal)
            throw new error_1.NotFoundError('Deal not found');
        return deal;
    }
    async getDeals(tenantId, filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.max(1, Number(filters.limit) || 20);
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (filters.stage &&
            Object.values(db_1.DealStage).includes(filters.stage)) {
            where.stage = filters.stage;
        }
        if (filters.companyId)
            where.companyId = filters.companyId;
        if (filters.assignedToId)
            where.assignedToId = filters.assignedToId;
        if (filters.search) {
            Object.assign(where, (0, search_1.buildSearchOR)(filters.search, ['title']));
        }
        const [deals, total] = await Promise.all([
            db_1.prisma.deal.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db_1.prisma.deal.count({ where }),
        ]);
        return { deals, total, page, limit };
    }
    async createTx(tx, data) {
        return tx.deal.create({
            data,
        });
    }
}
exports.DealsRepository = DealsRepository;
