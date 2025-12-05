import { prisma, Lead } from '../../core/db';
import { ILeadsRepository } from './leads.repo.interface';
import { CreateLeadDTO, UpdateLeadDTO, LeadQueryDTO } from './dto';

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

  // Get list of leads with optional filters, search, pagination
  async findAll(
    tenantId: string,
    query?: LeadQueryDTO
  ): Promise<{ leads: Lead[]; total: number }> {
    const page = query?.page ? parseInt(query.page, 10) : 1;
    const limit = query?.limit ? parseInt(query.limit, 10) : 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (query?.status) where.status = query.status;
    if (query?.assignedToId) where.assignedToId = query.assignedToId;
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return { leads, total };
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
    if (!lead) throw new Error('Lead not found');
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
}
