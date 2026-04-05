"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactsController = exports.contactsService = exports.contactsRepository = void 0;
const contacts_repo_1 = require("./contacts.repo");
const contacts_service_1 = require("./contacts.service");
const contacts_controller_1 = require("./contacts.controller");
exports.contactsRepository = new contacts_repo_1.ContactsRepository();
exports.contactsService = new contacts_service_1.ContactsService(exports.contactsRepository);
exports.contactsController = new contacts_controller_1.ContactsController(exports.contactsService);
