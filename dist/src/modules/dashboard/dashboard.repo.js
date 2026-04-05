"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const db_1 = require("../../core/db");
class DashboardRepository {
    async getPipelineSummary(tenantId) {
        return db_1.prisma.deal
            .groupBy({
            by: ['stage'],
            where: { tenantId },
            _count: { stage: true },
        })
            .then((result) => result.map((r) => ({
            stage: r.stage,
            count: r._count.stage,
        })));
    }
    async getTotals(tenantId) {
        const [leads, deals, contacts, companies] = await Promise.all([
            db_1.prisma.lead.count({ where: { tenantId } }),
            db_1.prisma.deal.count({ where: { tenantId } }),
            db_1.prisma.contact.count({ where: { tenantId } }),
            db_1.prisma.company.count({ where: { tenantId } }),
        ]);
        return { leads, deals, contacts, companies };
    }
    async getActivityStats(tenantId) {
        return db_1.prisma.activity
            .groupBy({
            by: ['type'],
            where: { tenantId },
            _count: { type: true },
        })
            .then((result) => result.map((r) => ({
            type: r.type,
            count: r._count.type,
        })));
    }
}
exports.DashboardRepository = DashboardRepository;
