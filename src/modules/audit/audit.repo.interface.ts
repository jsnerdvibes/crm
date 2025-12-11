import { AuditLog } from "../../core/db";
import { CreateAuditLogDTO, AuditLogQueryDTO } from "./dto";

export interface IAuditRepository {
  /**
   * Create a new audit log entry
   * Stores: action, resource, resourceId, userId, meta JSON
   */
  create(data: CreateAuditLogDTO): Promise<AuditLog>;

  /**
   * Find all audit logs for a single tenant
   * Supports filtering: resource, action, date range, pagination
   */
  findAll(
    tenantId: string,
    filters: AuditLogQueryDTO
  ): Promise<{ logs: AuditLog[]; total: number }>;

  /**
   * Get a single audit log by ID (tenant-scoped)
   */
  findById(tenantId: string, id: string): Promise<AuditLog | null>;
}
