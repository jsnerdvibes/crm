"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = void 0;
const audit_1 = require("../modules/audit");
const logAudit = async (tenantId, userId, action, resource, resourceId, meta) => {
    try {
        await audit_1.auditService.logAction({
            tenantId,
            userId: userId ?? null,
            action,
            resource,
            resourceId,
            meta: meta ?? {},
        });
    }
    catch (err) {
        // optionally log but do not fail the main operation
        console.error('Failed to log audit', err);
    }
};
exports.logAudit = logAudit;
