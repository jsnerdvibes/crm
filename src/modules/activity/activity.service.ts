import { IActivitiesRepository } from "./activity.repo.interface";
import { CreateActivityDTO, UpdateActivityDTO, ActivityResponse } from "./dto";
import { Activity } from "../../core/db";
import { BadRequestError, NotFoundError } from "../../core/error";

export class ActivitiesService {
  constructor(private repo: IActivitiesRepository) {}

  // -------------------------
  // Create a new activity
  // -------------------------
  async createActivity(
    tenantId: string,
    actorId: string | null,
    data: CreateActivityDTO
  ): Promise<ActivityResponse> {
    try {
      const activity = await this.repo.create(tenantId, actorId, data);
      return this.sanitize(activity);
    } catch (error) {
      throw new BadRequestError(
        "Failed to create activity. Please verify input data."
      );
    }
  }

  // -------------------------
  // Update existing activity
  // -------------------------
  async updateActivity(
    tenantId: string,
    activityId: string,
    data: UpdateActivityDTO
  ): Promise<ActivityResponse> {
    const existing = await this.repo.findById(tenantId, activityId);
    if (!existing) throw new NotFoundError("Activity not found");

    const updated = await this.repo.update(tenantId, activityId, data);
    return this.sanitize(updated);
  }

  // -------------------------
  // Delete an activity
  // -------------------------
  async deleteActivity(tenantId: string, activityId: string): Promise<void> {
    const existing = await this.repo.findById(tenantId, activityId);
    if (!existing) throw new NotFoundError("Activity not found");

    await this.repo.delete(tenantId, activityId);
  }

  // -------------------------
  // Get a single activity
  // -------------------------
  async getActivityById(
    tenantId: string,
    activityId: string
  ): Promise<ActivityResponse> {
    const activity = await this.repo.findById(tenantId, activityId);
    if (!activity) throw new NotFoundError("Activity not found");

    return this.sanitize(activity);
  }

  // -------------------------
  // Get activities timeline (polymorphic)
  // -------------------------
  async getActivities(tenantId: string, filters: any) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;

    const { activities, total } =
      await this.repo.getActivities(tenantId, filters);

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
  private sanitize(activity: Activity): ActivityResponse {
    return {
      id: activity.id,
      tenantId: activity.tenantId,
      actorId: activity.actorId,
      type: activity.type,
      targetType: activity.targetType as ActivityResponse["targetType"],
      targetId: activity.targetId,
      body: activity.body ?? null,
      dueAt: activity.dueAt ?? null,
      completed: activity.completed ?? false,
      createdAt: activity.createdAt,
    };
  }
}
