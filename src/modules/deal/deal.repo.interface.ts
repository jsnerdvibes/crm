import { Deal, DealStage, Prisma } from '../../core/db';
import { IBaseRepository } from '../../core/base.repository';
import { CreateDealDTO, UpdateDealDTO } from './dto';

export interface IDealsRepository extends IBaseRepository<Deal, CreateDealDTO, UpdateDealDTO> {
  findAll(tenantId: string): Promise<Deal[]>;

  assign(tenantId: string, dealId: string, assignedToId: string): Promise<Deal>;

  updateStage(
    tenantId: string,
    dealId: string,
    stage: DealStage
  ): Promise<Deal>;

  getDeals(
    tenantId: string,
    filters: {
      page?: number;
      limit?: number;
      stage?: DealStage;
      assignedToId?: string;
      companyId?: string;
      search?: string;
    }
  ): Promise<{ deals: Deal[]; total: number; page: number; limit: number }>;

  createTx(
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
  ): Promise<Deal>;
}
