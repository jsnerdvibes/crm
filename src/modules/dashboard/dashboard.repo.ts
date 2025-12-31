import { prisma } from "../../core/db";
import { DashboardRepo } from "./dashboard.repo.interface";

export class DashboardRepository implements DashboardRepo {

  async getPipelineSummary(tenantId: string) {
    return prisma.deal.groupBy({
      by: ["stage"],
      where: { tenantId },
      _count: { stage: true },
    }).then(result =>
      result.map(r => ({
        stage: r.stage,
        count: r._count.stage,
      }))
    );
  }

  async getTotals(tenantId: string) {
    const [leads, deals, contacts, companies] = await Promise.all([
      prisma.lead.count({ where: { tenantId } }),
      prisma.deal.count({ where: { tenantId } }),
      prisma.contact.count({ where: { tenantId } }),
      prisma.company.count({ where: { tenantId } }),
    ]);

    return { leads, deals, contacts, companies };
  }

  async getActivityStats(tenantId: string) {
    return prisma.activity.groupBy({
      by: ["type"],
      where: { tenantId },
      _count: { type: true },
    }).then(result =>
      result.map(r => ({
        type: r.type,
        count: r._count.type,
      }))
    );
  }
}
