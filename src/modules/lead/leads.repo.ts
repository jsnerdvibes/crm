import { prisma, Lead, Prisma } from '../../core/db';
import { ILeadsRepository } from './leads.repo.interface';
import { CreateLeadDTO, UpdateLeadDTO } from './dto';
import { NotFoundError } from '../../core/error';

export class LeadsRepository implements ILeadsRepository {
  // Create a new lead
  async create(tenantId: string, data: CreateLeadDTO): Promise<Lead> {
    return prisma.lead.create({
      data: {
        tenantId,
        title: data.title,
        description: data.description,
        source: data.source,
        status: data.status,
        contactId: data.contactId,
        assignedToId: data.assignedToId,
      },
    });
  }

  // Find a lead by ID within a tenant
  async findById(tenantId: string, leadId: string): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: {
        id: leadId,
        tenantId,
      },
    });
  }

  // Update a lead
  async update(
    tenantId: string,
    leadId: string,
    data: UpdateLeadDTO
  ): Promise<Lead> {
    await prisma.lead.updateMany({
      where: {
        id: leadId,
        tenantId,
      },
      data,
    });

    const lead = await this.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');
    return lead;
  }

  // Delete a lead
  async delete(tenantId: string, leadId: string): Promise<void> {
    await prisma.lead.deleteMany({
      where: {
        id: leadId,
        tenantId,
      },
    });
  }

  async assignLead(
    tenantId: string,
    leadId: string,
    assignedToId: string
  ): Promise<Lead> {
    await prisma.lead.updateMany({
      where: { id: leadId, tenantId },
      data: { assignedToId },
    });

    const lead = await this.findById(tenantId, leadId);
    if (!lead) throw new NotFoundError('Lead not found');
    return lead;
  }

  async getLeads(tenantId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (filters.status) where.status = filters.status;
    if (filters.source) where.source = filters.source;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.lead.count({ where });

    return { leads, total };
  }

  async findByIdWithRelations(
    tenantId: string,
    leadId: string
  ): Promise<Lead | null> {
    return prisma.lead.findFirst({
      where: {
        id: leadId,
        tenantId,
      },
      include: {
        contact: true,
        assignedTo: true,
      },
    });
  }

  async updateTx(
    tx: Prisma.TransactionClient,
    leadId: string,
    data: Partial<Lead>
  ): Promise<Lead> {
    const lead = await tx.lead.update({
      where: {
        id: leadId,
      },
      data,
    });

    return lead;
  }
}
