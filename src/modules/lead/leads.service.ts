import { ILeadsRepository } from './leads.repo.interface';
import { CreateLeadDTO, UpdateLeadDTO, LeadResponse } from './dto';
import { DealStage, Lead, LeadStatus, prisma } from '../../core/db';
import { BadRequestError, NotFoundError } from '../../core/error';
import { logAudit } from '../../utils/audit.log';
import { LogActions, LogResources } from '../../types/logActions';
import { IContactsRepository } from '../contact/contacts.repo.interface';
import { IDealsRepository } from '../deal/deal.repo.interface';

export class LeadsService {
  constructor(
    private repo: ILeadsRepository,
    private contactsRepo: IContactsRepository,
    private dealsRepo: IDealsRepository
  ) {}

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
// Convert Lead → Contact + Deal
// -------------------------
async convertLead(
  tenantId: string,
  leadId: string,
  performedById?: string
) {
  // Fetch lead with relations
  const lead = await this.repo.findByIdWithRelations(tenantId, leadId);

  
  if (!lead) throw new NotFoundError('Lead not found');

  if (lead.status === LeadStatus.QUALIFIED) {
    throw new BadRequestError('Lead already converted');
  }

  return prisma.$transaction(async (tx) => {
    // 1️⃣ Create or reuse contact
    const contact = lead.contactId
  ? await this.contactsRepo.findById(tenantId, lead.contactId)
  : await this.contactsRepo.createTx(tx, {
      tenantId,
      firstName: lead.title,
    });

if (!contact) {
  throw new NotFoundError('Associated contact not found');
}


    // 2️⃣ Create deal
    const deal = await this.dealsRepo.createTx(tx, {
      tenantId,
      title: lead.title,
      stage: DealStage.QUALIFICATION,
      assignedToId: lead.assignedToId ?? undefined,
      companyId: contact.companyId ?? undefined,
    });

    // 3️⃣ Update lead
    await this.repo.updateTx(tx, lead.id, {
      status: LeadStatus.QUALIFIED,
      contactId: contact.id,
    });

    // 4️⃣ Audit log
    await logAudit(
      tenantId,
      performedById,
      LogActions.CONVERT,
      LogResources.LEAD,
      lead.id,
      {
        contactId: contact.id,
        dealId: deal.id,
      }
    );

    return {
      leadId: lead.id,
      contactId: contact.id,
      dealId: deal.id,
    };
  });
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
