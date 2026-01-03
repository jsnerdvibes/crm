import { auditService } from '../modules/audit';

export const logAudit = async (
  tenantId: string,
  userId: string | undefined,
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'DEACTIVATE'
    | 'ASSIGNED'
    | 'UPDATE_STAGE'
    | 'CONVERT',
  resource: string,
  resourceId: string,
  meta?: Record<string, unknown>
) => {
  try {
    await auditService.logAction({
      tenantId,
      userId: userId ?? null,
      action,
      resource,
      resourceId,
      meta: meta ?? {},
    });
  } catch (err) {
    // optionally log but do not fail the main operation
    console.error('Failed to log audit', err);
  }
};
