"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const error_1 = require("../../core/error");
class AuditService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------------------------------------
    // Create new audit log
    // This will be called by other services: lead, deal, user, company
    // -------------------------------------------------------
    async logAction(data) {
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
    async getLogs(tenantId, filters) {
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
    async getLogById(tenantId, id) {
        const log = await this.repo.findById(tenantId, id);
        if (!log)
            throw new error_1.NotFoundError('Audit log not found');
        return log;
    }
}
exports.AuditService = AuditService;
