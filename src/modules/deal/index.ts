import { DealsRepository } from './deal.repo';
import { DealsService } from './deal.service';
import { DealsController } from './deal.controller';

export const dealsRepository = new DealsRepository();
export const dealsService = new DealsService(dealsRepository);
export const dealsController = new DealsController(dealsService);
