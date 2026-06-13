import { Activity } from '../../core/db';
import { CreateActivityDTO, UpdateActivityDTO } from './dto';
import { IBaseRepository } from '../../core/base.repository';

export interface IActivitiesRepository extends IBaseRepository<Activity, CreateActivityDTO & { actorId?: string | null }, UpdateActivityDTO> {
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
