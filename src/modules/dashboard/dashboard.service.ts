import { DashboardRepo } from './dashboard.repo.interface';

export class DashboardService {
  constructor(private readonly repo: DashboardRepo) {}

  async getPipelineSummary(tenantId: string) {
    const data = await this.repo.getPipelineSummary(tenantId);

    return data.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.stage] = curr.count;
      return acc;
    }, {});
  }

  async getTotals(tenantId: string) {
    return this.repo.getTotals(tenantId);
  }

  async getActivityStats(tenantId: string) {
    const data = await this.repo.getActivityStats(tenantId);

    return data.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.type] = curr.count;
      return acc;
    }, {});
  }
}
