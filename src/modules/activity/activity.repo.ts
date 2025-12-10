import { prisma, Activity } from '../../core/db';
import { IActivitiesRepository } from './activity.repo.interface';
import { CreateActivityDTO, UpdateActivityDTO } from './dto';
import { NotFoundError } from '../../core/error';

export class ActivitiesRepository implements IActivitiesRepository {
  /**
   * Create a new activity
   */
  async create(
    tenantId: string,
    actorId: string | null,
    data: CreateActivityDTO
  ): Promise<Activity> {
    return prisma.activity.create({
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
  async findById(
    tenantId: string,
    activityId: string
  ): Promise<Activity | null> {
    return prisma.activity.findFirst({
      where: {
        id: activityId,
        tenantId,
      },
    });
  }

  /**
   * Update an activity
   */
  async update(
    tenantId: string,
    activityId: string,
    data: UpdateActivityDTO
  ): Promise<Activity> {
    await prisma.activity.updateMany({
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
    if (!updated) throw new NotFoundError('Activity not found');

    return updated;
  }

  /**
   * Delete an activity
   */
  async delete(tenantId: string, activityId: string): Promise<void> {
    await prisma.activity.deleteMany({
      where: {
        id: activityId,
        tenantId,
      },
    });
  }

  /**
   * Get activities timeline (polymorphic)
   */
  async getActivities(tenantId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (filters.targetType) where.targetType = filters.targetType;
    if (filters.targetId) where.targetId = filters.targetId;
    if (typeof filters.completed === 'boolean')
      where.completed = filters.completed;

    const activities = await prisma.activity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.activity.count({ where });

    return { activities, total };
  }
}