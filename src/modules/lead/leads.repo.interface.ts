import { Lead, Prisma } from '../../core/db';
import { CreateLeadDTO, UpdateLeadDTO } from './dto';
import { IBaseRepository } from '../../core/base.repository';

export interface ILeadsRepository extends IBaseRepository<Lead, CreateLeadDTO, UpdateLeadDTO> {
  assignLead(
    tenantId: string,
    leadId: string,
    assignedToId: string
  ): Promise<Lead>;

  getLeads(
    tenantId: string,
    filters: {
      page?: number;
      limit?: number;
      status?: string;
      source?: string;
      search?: string;
      assignedToId?: string;
    }
  ): Promise<{ leads: Lead[]; total: number }>;

  findByIdWithRelations(tenantId: string, leadId: string): Promise<Lead | null>;

  updateTx(
    tx: Prisma.TransactionClient,
    leadId: string,
    data: Partial<Lead>
  ): Promise<Lead>;
}
