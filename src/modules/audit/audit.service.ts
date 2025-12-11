import { IAuditRepository } from "./audit.repo.interface";
import { CreateAuditLogDTO, AuditLogQueryDTO } from "./dto";
import { AuditLog } from "../../core/db";
import { NotFoundError } from "../../core/error";

export class AuditService {
  constructor(private repo: IAuditRepository) {}

  // -------------------------------------------------------
  // Create new audit log
  // This will be called by other services: lead, deal, user, company
  // -------------------------------------------------------
  async logAction(data: CreateAuditLogDTO): Promise<AuditLog> {
    return this.repo.create({
      tenantId: data.tenantId,
      userId: data.userId ?? null,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      meta: data.meta ?? {},
    });
  }

  // -------------------------------------------------------
  // Get logs with filters + pagination
  // -------------------------------------------------------
  async getLogs(
    tenantId: string,
    filters: AuditLogQueryDTO
  ): Promise<{ logs: AuditLog[]; total: number; page: number; limit: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { logs, total } = await this.repo.findAll(tenantId, filters);

    return {
      logs,
      total,
      page,
      limit,
    };
  }

  // -------------------------------------------------------
  // Get single log
  // -------------------------------------------------------
  async getLogById(tenantId: string, id: string): Promise<AuditLog> {
    const log = await this.repo.findById(tenantId, id);
    if (!log) throw new NotFoundError("Audit log not found");

    return log;
  }
}
