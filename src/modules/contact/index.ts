import { ContactsRepository } from './contacts.repo';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';

export const contactsRepository = new ContactsRepository();
export const contactsService = new ContactsService(contactsRepository);
export const contactsController = new ContactsController(contactsService);
