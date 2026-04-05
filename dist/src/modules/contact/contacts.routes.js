"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const validate_1 = require("../../middlewares/validate");
const dto_1 = require("./dto");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// --------------------------------------
// Create a new contact
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateContactSchema), index_1.contactsController.create);
// --------------------------------------
// Get all contacts
// --------------------------------------
router.get('/', index_1.contactsController.getAll);
// --------------------------------------
// Get single contact by ID
// --------------------------------------
router.get('/:id', index_1.contactsController.getById);
// --------------------------------------
// Update contact
// --------------------------------------
router.patch('/:id', (0, validate_1.validate)(dto_1.UpdateContactSchema), index_1.contactsController.update);
// --------------------------------------
// Delete contact
// --------------------------------------
router.delete('/:id', index_1.contactsController.delete);
exports.default = router;
