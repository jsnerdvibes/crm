import { ActivitiesRepository } from './activity.repo';
import { ActivitiesService } from './activity.service';
import { ActivitiesController } from './activity.controller';

export const activitiesRepository = new ActivitiesRepository();
export const activitiesService = new ActivitiesService(activitiesRepository);
export const activitiesController = new ActivitiesController(activitiesService);
