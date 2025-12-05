import { ILeadsRepository } from './leads.repo.interface';
import { CreateLeadDTO, UpdateLeadDTO, LeadResponse } from './dto';
import { Lead } from '../../core/db';
import { BadRequestError, NotFoundError } from '../../core/error';

export class LeadsService {
  constructor(private repo: ILeadsRepository) {}

  // -------------------------
  // Create a new lead
  // -------------------------
  async createLead(tenantId: string, data: CreateLeadDTO): Promise<LeadResponse> {
    // Optional: check if title already exists in tenant
    // const existing = await this.repo.findAll(tenantId, { search: data.title });
    // if (existing.total > 0) throw new BadRequestError('Lead title already exists');

    try {
      const lead = await this.repo.create(tenantId, data);
    return this.sanitize(lead);
    } catch (error) {
      throw new BadRequestError('Failed to create lead. Please check your input data.');
    }
  }

  // -------------------------
  // Update existing lead
  // -------------------------
  async updateLead(
    tenantId: string,
    leadId: string,
    data: UpdateLeadDTO
  ): Promise<LeadResponse> {

    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    const updatedLead = await this.repo.update(tenantId, leadId, data);
    return this.sanitize(updatedLead);

  }

  // -------------------------
  // Delete a lead
  // -------------------------
async deleteLead(tenantId: string, leadId: string): Promise<void> {
    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    await this.repo.delete(tenantId, leadId);
    throw Error("Error occured while deleting lead");
}


  // -------------------------
  // Get a single lead
  // -------------------------
async getLeadById(tenantId: string, leadId: string): Promise<LeadResponse> {
    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    return this.sanitize(lead);
}

  // -------------------------
  // Get all leads with filters
  // -------------------------
async getAllLeads(
  tenantId: string,
  query?: any // LeadQueryDTO
): Promise<{ leads: LeadResponse[]; page: number; limit: number; total: number }> {
  try {
    const { leads, total } = await this.repo.findAll(tenantId, query);
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 20;

    return {
      leads: leads.map(this.sanitize),
      page,
      limit,
      total,
    };
  } catch (error) {
    throw Error("Error occured while getting all leads");
  }
}


  // -------------------------
  // Helper: sanitize lead for response
  // -------------------------
  private sanitize(lead: Lead): LeadResponse {
    return {
      id: lead.id,
      title: lead.title,
      description: lead.description ?? null,
      source: lead.source ?? null,
      status: lead.status,
      contactId: lead.contactId ?? null,
      assignedToId: lead.assignedToId ?? null,
      createdAt: lead.createdAt,
    };
  }
}
