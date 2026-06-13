import { prisma, Activity, Prisma } from '../../core/db';
import { IActivitiesRepository } from './activity.repo.interface';
import { CreateActivityDTO, UpdateActivityDTO } from './dto';
import { ActivityFilters } from './types';
import { BaseRepository } from '../../core/base.repository';

export class ActivitiesRepository extends BaseRepository<Activity, CreateActivityDTO & { actorId?: string | null }, UpdateActivityDTO> implements IActivitiesRepository {
  constructor() {
    super('activity');
  }

  async create(
    tenantId: string,
    data: CreateActivityDTO & { actorId?: string | null }
  ): Promise<Activity> {
    return prisma.activity.create({
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

  async getActivities(tenantId: string, filters: ActivityFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ActivityWhereInput = { tenantId };

    if (filters.targetType) where.targetType = filters.targetType;
    if (filters.targetId) where.targetId = filters.targetId;
    if (filters.completed !== undefined) where.completed = filters.completed;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activity.count({ where }),
    ]);

    return { activities, total };
  }
}
