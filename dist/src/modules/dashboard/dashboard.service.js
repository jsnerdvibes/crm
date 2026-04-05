"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
class DashboardService {
    constructor(repo) {
        this.repo = repo;
    }
    async getPipelineSummary(tenantId) {
        const data = await this.repo.getPipelineSummary(tenantId);
        return data.reduce((acc, curr) => {
            acc[curr.stage] = curr.count;
            return acc;
        }, {});
    }
    async getTotals(tenantId) {
        return this.repo.getTotals(tenantId);
    }
    async getActivityStats(tenantId) {
        const data = await this.repo.getActivityStats(tenantId);
        return data.reduce((acc, curr) => {
            acc[curr.type] = curr.count;
            return acc;
        }, {});
    }
}
exports.DashboardService = DashboardService;
