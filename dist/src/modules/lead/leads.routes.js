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
// Get all leads (with optional filters)
// --------------------------------------
router.get('/', index_1.leadsController.findAll);
// --------------------------------------
// Create a new lead
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateLeadSchema), index_1.leadsController.create);
// --------------------------------------
// Convert lead → contact + deal
// --------------------------------------
router.post('/:id/convert', index_1.leadsController.convertLead);
// --------------------------------------
// Update a lead by ID
// --------------------------------------
router.patch('/:id', (0, validate_1.validate)(dto_1.UpdateLeadSchema), index_1.leadsController.update);
// --------------------------------------
// Delete a lead by ID
// --------------------------------------
router.delete('/:id', index_1.leadsController.delete);
// Assign lead to a user
router.patch('/:id/assign', index_1.leadsController.assignLead);
// --------------------------------------
// Get a single lead by ID
// --------------------------------------
router.get('/:id', index_1.leadsController.findById);
exports.default = router;
