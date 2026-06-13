"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesService = void 0;
const error_1 = require("../../core/error");
const audit_log_1 = require("../../utils/audit.log");
const logActions_1 = require("../../types/logActions");
const logger_1 = require("../../core/logger");
class ActivitiesService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------
    // Create a new activity
    // -------------------------
    async createActivity(tenantId, actorId, data, performedById) {
        try {
            const activity = await this.repo.create(tenantId, { ...data, actorId });
            const sanitized = this.sanitize(activity);
            // log audit
            await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.CREATE, logActions_1.LogResources.ACTIVITY, activity.id, { title: activity.body });
            return sanitized;
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new error_1.BadRequestError('Failed to create activity. Please verify input data.');
        }
    }
    // -------------------------
    // Update existing activity
    // -------------------------
    async updateActivity(tenantId, activityId, data, performedById) {
        const existing = await this.repo.findById(tenantId, activityId);
        if (!existing)
            throw new error_1.NotFoundError('Activity not found');
        const updated = await this.repo.update(tenantId, activityId, data);
        const sanitized = this.sanitize(updated);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.ACTIVITY, updated.id, { title: updated.body });
        return sanitized;
    }
    // -------------------------
    // Delete an activity
    // -------------------------
    async deleteActivity(tenantId, activityId, performedById) {
        const existing = await this.repo.findById(tenantId, activityId);
        if (!existing)
            throw new error_1.NotFoundError('Activity not found');
        await this.repo.delete(tenantId, activityId);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.ACTIVITY, activityId, { title: existing.body });
    }
    // -------------------------
    // Get a single activity
    // -------------------------
    async getActivityById(tenantId, activityId) {
        const activity = await this.repo.findById(tenantId, activityId);
        if (!activity)
            throw new error_1.NotFoundError('Activity not found');
        return this.sanitize(activity);
    }
    // -------------------------
    // Get activities timeline (polymorphic)
    // -------------------------
    async getActivities(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const { activities, total } = await this.repo.getActivities(tenantId, filters);
        return {
            activities: activities.map((a) => this.sanitize(a)),
            page,
            limit,
            total,
        };
    }
    // -------------------------
    // Helper: sanitize response
    // -------------------------
    sanitize(activity) {
        return {
            id: activity.id,
            tenantId: activity.tenantId,
            actorId: activity.actorId,
            type: activity.type,
            targetType: activity.targetType,
            targetId: activity.targetId,
            body: activity.body ?? null,
            dueAt: activity.dueAt ?? null,
            completed: activity.completed ?? false,
            createdAt: activity.createdAt,
        };
    }
}
exports.ActivitiesService = ActivitiesService;
