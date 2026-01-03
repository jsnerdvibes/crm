import { IDealsRepository } from './deal.repo.interface';
import { CreateDealDTO, UpdateDealDTO, DealResponse } from './dto';
import { Deal, DealStage } from '../../core/db';
import { BadRequestError, NotFoundError } from '../../core/error';
import { logAudit } from '../../utils/audit.log';
import { LogActions, LogResources } from '../../types/logActions';
import { logger } from '../../core/logger';
import { DealFilters } from './types';

export class DealsService {
  constructor(private repo: IDealsRepository) {}

  // -------------------------------------
  // Create a new deal
  // -------------------------------------
  async createDeal(
    tenantId: string,
    data: CreateDealDTO,
    performedById?: string
  ): Promise<DealResponse> {
    try {
      const deal = await this.repo.create(tenantId, data);

      const sanitized = this.sanitize(deal);

      // log audit
      await logAudit(
        tenantId,
        performedById,
        LogActions.CREATE,
        LogResources.DEAL,
        deal.id,
        { title: deal.title }
      );

      return sanitized;
    } catch (error) {
      logger.error(error);
      throw new BadRequestError(
        'Failed to create deal. Please check your input data.'
      );
    }
  }

  // -------------------------------------
  // Update deal
  // -------------------------------------
  async updateDeal(
    tenantId: string,
    dealId: string,
    data: UpdateDealDTO,
    performedById?: string
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.update(tenantId, dealId, data);

    const sanitized = this.sanitize(updated);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.UPDATE,
      LogResources.DEAL,
      updated.id,
      { title: updated.title }
    );

    return sanitized;
  }

  // -------------------------------------
  // Delete deal
  // -------------------------------------
  async deleteDeal(
    tenantId: string,
    dealId: string,
    performedById?: string
  ): Promise<void> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    await this.repo.delete(tenantId, dealId);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.DELETE,
      LogResources.DEAL,
      dealId,
      { title: deal.title }
    );
  }

  // -------------------------------------
  // Get single deal by ID
  // -------------------------------------
  async getDealById(tenantId: string, dealId: string): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    return this.sanitize(deal);
  }

  // -------------------------------------
  // Assign deal to user
  // -------------------------------------
  async assignDeal(
    tenantId: string,
    dealId: string,
    assignedToId: string,
    performedById?: string
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.assign(tenantId, dealId, assignedToId);

    const sanitized = this.sanitize(updated);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.ASSIGNED,
      LogResources.DEAL,
      updated.id,
      { title: updated.title }
    );

    return sanitized;
  }

  // -------------------------------------
  // Update Deal Stage (Workflow)
  // -------------------------------------
  async updateDealStage(
    tenantId: string,
    dealId: string,
    stage: DealStage,
    performedById?: string
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.updateStage(tenantId, dealId, stage);

    const sanitized = this.sanitize(updated);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.UPDATE_STAGE,
      LogResources.DEAL,
      updated.id,
      { title: updated.title }
    );

    return sanitized;
  }

  // -------------------------------------
  // List deals with filters & pagination
  // -------------------------------------
  async getDeals(tenantId: string, filters: DealFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { deals, total } = await this.repo.getDeals(tenantId, filters);

    return {
      deals: deals.map(this.sanitize),
      page,
      limit,
      total,
    };
  }

  // -------------------------------------
  // Helper: sanitize deal output
  // -------------------------------------
  private sanitize(deal: Deal): DealResponse {
    return {
      id: deal.id,
      title: deal.title,
      amount: deal.amount ?? null,
      probability: deal.probability ?? null,
      stage: deal.stage,
      companyId: deal.companyId ?? null,
      assignedToId: deal.assignedToId ?? null,
      createdAt: deal.createdAt,
    };
  }
}
