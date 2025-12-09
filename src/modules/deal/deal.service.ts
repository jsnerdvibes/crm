import { IDealsRepository } from './deal.repo.interface';
import {
  CreateDealDTO,
  UpdateDealDTO,
  DealResponse,
} from './dto';
import { Deal, DealStage } from '../../core/db';
import { BadRequestError, NotFoundError } from '../../core/error';

export class DealsService {
  constructor(private repo: IDealsRepository) {}

  // -------------------------------------
  // Create a new deal
  // -------------------------------------
  async createDeal(tenantId: string, data: CreateDealDTO): Promise<DealResponse> {
    try {
      const deal = await this.repo.create(tenantId, data);
      return this.sanitize(deal);
    } catch (error) {
      throw new BadRequestError('Failed to create deal. Please check your input data.');
    }
  }

  // -------------------------------------
  // Update deal
  // -------------------------------------
  async updateDeal(
    tenantId: string,
    dealId: string,
    data: UpdateDealDTO
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.update(tenantId, dealId, data);
    return this.sanitize(updated);
  }

  // -------------------------------------
  // Delete deal
  // -------------------------------------
  async deleteDeal(tenantId: string, dealId: string): Promise<void> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    await this.repo.delete(tenantId, dealId);
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
    assignedToId: string
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.assign(tenantId, dealId, assignedToId);
    return this.sanitize(updated);
  }

  // -------------------------------------
  // Update Deal Stage (Workflow)
  // -------------------------------------
  async updateDealStage(
    tenantId: string,
    dealId: string,
    stage: DealStage
  ): Promise<DealResponse> {
    const deal = await this.repo.findById(tenantId, dealId);
    if (!deal) throw new NotFoundError('Deal not found');

    const updated = await this.repo.updateStage(tenantId, dealId, stage);
    return this.sanitize(updated);
  }

  // -------------------------------------
  // List deals with filters & pagination
  // -------------------------------------
  async getDeals(tenantId: string, filters: any) {
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