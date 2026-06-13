"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitiesRepository = void 0;
const db_1 = require("../../core/db");
const base_repository_1 = require("../../core/base.repository");
class ActivitiesRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('activity');
    }
    async create(tenantId, data) {
        return db_1.prisma.activity.create({
            data: {
                tenantId,
                actorId: data.actorId ?? null,
                type: data.type,
                targetType: data.targetType,
                targetId: data.targetId,
                body: data.body,
                dueAt: data.dueAt ? new Date(data.dueAt) : null,
                completed: data.completed,
            },
        });
    }
    async getActivities(tenantId, filters) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = { tenantId };
        if (filters.targetType)
            where.targetType = filters.targetType;
        if (filters.targetId)
            where.targetId = filters.targetId;
        if (filters.completed !== undefined)
            where.completed = filters.completed;
        const [activities, total] = await Promise.all([
            db_1.prisma.activity.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            db_1.prisma.activity.count({ where }),
        ]);
        return { activities, total };
    }
}
exports.ActivitiesRepository = ActivitiesRepository;
