import { LeadsRepository } from './leads.repo';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';

export const leadsRepository = new LeadsRepository();
export const leadsService = new LeadsService(leadsRepository);
export const leadsController = new LeadsController(leadsService);
