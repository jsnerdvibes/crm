import { prisma, Deal, DealStage, Prisma } from '../../core/db';
import { IDealsRepository } from './deal.repo.interface';
import { NotFoundError } from '../../core/error';

export class DealsRepository implements IDealsRepository {
  async create(tenantId: string, data: any): Promise<Deal> {
    return prisma.deal.create({
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

  async findById(tenantId: string, dealId: string): Promise<Deal | null> {
    return prisma.deal.findFirst({
      where: { id: dealId, tenantId },
    });
  }

  async findAll(tenantId: string): Promise<Deal[]> {
    return prisma.deal.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(tenantId: string, dealId: string, data: any): Promise<Deal> {
    await prisma.deal.updateMany({
      where: { id: dealId, tenantId },
      data,
    });

    const deal = await this.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    return deal;
  }

  async delete(tenantId: string, dealId: string): Promise<void> {
    await prisma.deal.deleteMany({
      where: { id: dealId, tenantId },
    });
  }

  async assign(
    tenantId: string,
    dealId: string,
    assignedToId: string
  ): Promise<Deal> {
    await prisma.deal.updateMany({
      where: { id: dealId, tenantId },
      data: { assignedToId },
    });

    const deal = await this.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    return deal;
  }

  async updateStage(
    tenantId: string,
    dealId: string,
    stage: DealStage
  ): Promise<Deal> {
    await prisma.deal.updateMany({
      where: { id: dealId, tenantId },
      data: { stage },
    });

    const deal = await this.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    return deal;
  }

  async getDeals(tenantId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (filters.stage) where.stage = filters.stage;
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.search) {
      where.OR = [{ title: { contains: filters.search, mode: 'insensitive' } }];
    }

    const deals = await prisma.deal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.deal.count({ where });

    return { deals, total };
  }

  async createTx(
    tx: Prisma.TransactionClient,
    data: {
      tenantId: string;
      title: string;
      amount?: number | null;
      probability?: number | null;
      stage: DealStage;
      companyId?: string | null;
      assignedToId?: string | null;
    }
  ): Promise<Deal> {
    return tx.deal.create({
      data,
    });
  }
}
