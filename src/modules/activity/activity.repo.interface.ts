import { Activity } from '../../core/db';
import { CreateActivityDTO, UpdateActivityDTO } from './dto';

export interface IActivitiesRepository {
  /**
   * Create a new activity for a tenant
   * actorId will be injected from auth middleware
   */
  create(
    tenantId: string,
    actorId: string | null,
    data: CreateActivityDTO
  ): Promise<Activity>;

  /**
   * Find an activity by ID within a tenant
   */
  findById(tenantId: string, activityId: string): Promise<Activity | null>;

  /**
   * Update an existing activity
   */
  update(
    tenantId: string,
    activityId: string,
    data: UpdateActivityDTO
  ): Promise<Activity>;

  /**
   * Delete an activity
   */
  delete(tenantId: string, activityId: string): Promise<void>;

  /**
   * Get activities (timeline)
   * Supports polymorphic filters
   */
  getActivities(
    tenantId: string,
    filters: {
      page?: number;
      limit?: number;
      targetType?: string; // Lead, Contact, Deal, Company
      targetId?: string;
      completed?: boolean;
    }
  ): Promise<{ activities: Activity[]; total: number }>;
}
