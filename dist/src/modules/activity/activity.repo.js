"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesRepository = void 0;
const db_1 = require("../../core/db");
const error_1 = require("../../core/error");
class ActivitiesRepository {
    /**
     * Create a new activity
     */
    async create(tenantId, actorId, data) {
        return db_1.prisma.activity.create({
            data: {
                tenantId,
                actorId,
                type: data.type,
                targetType: data.targetType,
                targetId: data.targetId,
                body: data.body,
                dueAt: data.dueAt ? new Date(data.dueAt) : null,
                completed: data.completed ?? false,
            },
        });
    }
    /**
     * Find activity by ID within tenant
     */
    async findById(tenantId, activityId) {
        return db_1.prisma.activity.findFirst({
            where: {
                id: activityId,
                tenantId,
            },
        });
    }
    /**
     * Update an activity
     */
    async update(tenantId, activityId, data) {
        await db_1.prisma.activity.updateMany({
            where: {
                id: activityId,
                tenantId,
            },
            data: {
                body: data.body,
                dueAt: data.dueAt ? new Date(data.dueAt) : null,
                completed: data.completed,
            },
        });
        const updated = await this.findById(tenantId, activityId);
        if (!updated)
            throw new error_1.NotFoundError('Activity not found');
        return updated;
    }
    /**
     * Delete an activity
     */
    async delete(tenantId, activityId) {
        await db_1.prisma.activity.deleteMany({
            where: {
                id: activityId,
                tenantId,
            },
        });
    }
    /**
     * Get activities timeline (polymorphic)
     */
    async getActivities(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (filters.targetType)
            where.targetType = filters.targetType;
        if (filters.targetId)
            where.targetId = filters.targetId;
        if (typeof filters.completed === 'boolean')
            where.completed = filters.completed;
        const activities = await db_1.prisma.activity.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        const total = await db_1.prisma.activity.count({ where });
        return { activities, total };
    }
}
exports.ActivitiesRepository = ActivitiesRepository;
