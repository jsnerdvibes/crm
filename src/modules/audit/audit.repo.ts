import { prisma, AuditLog } from '../../core/db';
import { IAuditRepository } from './audit.repo.interface';
import { CreateAuditLogDTO, AuditLogQueryDTO } from './dto';

export class AuditRepository implements IAuditRepository {
  /**
   * Create a new audit log entry
   */
  async create(data: CreateAuditLogDTO): Promise<AuditLog> {
    return prisma.auditLog.create({
      data: {
        tenantId: data.tenantId,
        userId: data.userId || null,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        meta: data.meta || {}, // MySQL JSON supported
      },
    });
  }

  /**
   * Get audit logs for a tenant with filters + pagination
   */
  async findAll(
    tenantId: string,
    filters: AuditLogQueryDTO
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (filters.resource) where.resource = filters.resource;
    if (filters.resourceId) where.resourceId = filters.resourceId;
    if (filters.action) where.action = filters.action;

    // Date filtering
    if (filters.from || filters.to) {
      where.createdAt = {};
      if (filters.from) where.createdAt.gte = new Date(filters.from);
      if (filters.to) where.createdAt.lte = new Date(filters.to);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.auditLog.count({ where });

    return { logs, total };
  }

  /**
   * Get a single audit log by ID (tenant scoped)
   */
  async findById(tenantId: string, id: string): Promise<AuditLog | null> {
    return prisma.auditLog.findFirst({
      where: { id, tenantId },
    });
  }
}
