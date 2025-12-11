import { AuditRepository } from './audit.repo';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

export const auditRepository = new AuditRepository();
export const auditService = new AuditService(auditRepository);
export const auditController = new AuditController(auditService);
