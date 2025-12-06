import { Lead } from '../../core/db';
import { CreateLeadDTO, UpdateLeadDTO } from './dto';

export interface ILeadsRepository {
  /**
   * Create a new lead for a tenant
   */
  create(tenantId: string, data: CreateLeadDTO): Promise<Lead>;

  /**
   * Find lead by ID within a tenant
   */
  findById(tenantId: string, leadId: string): Promise<Lead | null>;


  /**
   * Update an existing lead
   */
  update(tenantId: string, leadId: string, data: UpdateLeadDTO): Promise<Lead>;

  /**
   * Delete a lead
   */
  delete(tenantId: string, leadId: string): Promise<void>;


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



}
