import { ILeadsRepository } from './leads.repo.interface';
import { CreateLeadDTO, UpdateLeadDTO, LeadResponse } from './dto';
import { Lead } from '../../core/db';
import { BadRequestError, NotFoundError } from '../../core/error';
import { auditService } from '../audit';
import { logAudit } from '../../utils/audit.log';
import { LogActions, LogResources } from '../../types/logActions';

export class LeadsService {
  constructor(private repo: ILeadsRepository) {}

  // -------------------------
  // Create a new lead
  // -------------------------
  async createLead(
    tenantId: string, 
    data: CreateLeadDTO,
    performedById?:string
  ): Promise<LeadResponse> {
    // Optional: check if title already exists in tenant
    // const existing = await this.repo.findAll(tenantId, { search: data.title });
    // if (existing.total > 0) throw new BadRequestError('Lead title already exists');

    try {
      const lead = await this.repo.create(tenantId, data);

      const sanitized = this.sanitize(lead);


    await logAudit(
    tenantId,
    performedById,
    'CREATE',
    LogResources.LEAD,
    lead.id,
    { title: lead.title }
  );

    return sanitized

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
    data: UpdateLeadDTO,
    performedById?:string
  ): Promise<LeadResponse> {

    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    const updatedLead = await this.repo.update(tenantId, leadId, data);

    const sanitized = this.sanitize(updatedLead);


    await logAudit(
    tenantId,
    performedById,
    LogActions.UPDATE,
    LogResources.LEAD,
    lead.id,
    { title: lead.title }
  );

    return sanitized

  }

  // -------------------------
  // Delete a lead
  // -------------------------
async deleteLead(
  tenantId: string, 
  leadId: string,
  performedById?:string
): Promise<void> {
    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    await this.repo.delete(tenantId, leadId);

    await logAudit(
    tenantId,
    performedById,
    LogActions.DELETE,
    LogResources.LEAD,
    lead.id,
    { title: lead.title }
  );

}


  // -------------------------
  // Get a single lead
  // -------------------------
async getLeadById(tenantId: string, leadId: string): Promise<LeadResponse> {
    const lead = await this.repo.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');

    return this.sanitize(lead);
}




async assignLead(
  tenantId: string,
  leadId: string,
  assignedToId: string,
  performedById?:string
): Promise<LeadResponse> {
  const lead = await this.repo.findById(tenantId, leadId);
  if (!lead) throw new NotFoundError('Lead not found');

  const updated = await this.repo.assignLead(tenantId, leadId, assignedToId);

    const sanitized = this.sanitize(updated);

    await logAudit(
    tenantId,
    performedById,
    LogActions.ASSIGNED,
    LogResources.LEAD,
    lead.id,
    { title: lead.title }
  );

    return sanitized
}


async getLeads(tenantId: string, filters: any) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;

  const { leads, total } = await this.repo.getLeads(tenantId, filters);

  return {
    leads: leads.map(this.sanitize),
    page,
    limit,
    total,
  };
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
