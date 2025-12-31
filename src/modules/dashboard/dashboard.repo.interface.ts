export interface DashboardRepo {
  getPipelineSummary(
    tenantId: string
  ): Promise<{ stage: string; count: number }[]>;

  getTotals(tenantId: string): Promise<{
    leads: number;
    deals: number;
    contacts: number;
    companies: number;
  }>;

  getActivityStats(
    tenantId: string
  ): Promise<{ type: string; count: number }[]>;
}
