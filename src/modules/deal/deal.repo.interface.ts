import { Deal, DealStage, Prisma } from '../../core/db';

export interface IDealsRepository {
  create(
    tenantId: string,
    data: {
      title: string;
      amount?: number | null;
      probability?: number | null;
      stage: DealStage;
      companyId?: string | null;
      assignedToId?: string | null;
    }
  ): Promise<Deal>;

  findById(tenantId: string, dealId: string): Promise<Deal | null>;

  findAll(tenantId: string): Promise<Deal[]>;

  update(
    tenantId: string,
    dealId: string,
    data: Partial<{
      title: string;
      amount?: number | null;
      probability?: number | null;
      stage: DealStage;
      companyId?: string | null;
      assignedToId?: string | null;
    }>
  ): Promise<Deal>;

  delete(tenantId: string, dealId: string): Promise<void>;

  assign(
    tenantId: string,
    dealId: string,
    assignedToId: string
  ): Promise<Deal>;

  updateStage(
    tenantId: string,
    dealId: string,
    stage: DealStage
  ): Promise<Deal>;

  /**
   * Pagination + Filtering
   */
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
  ): Promise<{ deals: Deal[]; total: number }>;


    /**
   * Create deal inside a transaction (used for lead conversion)
   */
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
