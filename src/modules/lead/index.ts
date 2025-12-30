import { LeadsRepository } from './leads.repo';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { ContactsRepository } from '../contact/contacts.repo';
import { DealsRepository } from '../deal/deal.repo';

export const leadsRepository = new LeadsRepository();
const contactsRepo = new ContactsRepository();
const dealsRepo = new DealsRepository();


export const leadsService = new LeadsService(
    leadsRepository,
    contactsRepo,
    dealsRepo
);
export const leadsController = new LeadsController(leadsService);
