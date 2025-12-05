import { Lead } from '../../core/db';
import { CreateLeadDTO, UpdateLeadDTO, LeadQueryDTO, LeadFilterDTO } from './dto';

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
   * Get list of leads with optional filters, search, and pagination
   */
  findAll(
    tenantId: string,
    query?: LeadQueryDTO
  ): Promise<{ leads: Lead[]; total: number }>;

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


  findWithFilters(
    tenantId: string,
    filters: {
      page?: string;
      limit?: string;
      search?: string;
      status?: "NEW" | "CONTACTED" | "QUALIFIED" | "LOST";
      assignedToId?: string;
    }
  ): Promise<{ leads: Lead[]; total: number }>;


}
