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
// Get all deals (with optional filters)
// --------------------------------------
router.get('/', index_1.dealsController.findAll);
// --------------------------------------
// Create a new deal
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateDealSchema), index_1.dealsController.create);
// --------------------------------------
// Update a deal by ID
// --------------------------------------
router.patch('/:id', (0, validate_1.validate)(dto_1.UpdateDealSchema), index_1.dealsController.update);
// --------------------------------------
// Delete a deal by ID
// --------------------------------------
router.delete('/:id', index_1.dealsController.delete);
// --------------------------------------
// Assign deal to a user
// --------------------------------------
router.patch('/:id/assign', index_1.dealsController.assignDeal);
// --------------------------------------
// Update deal stage (pipeline movement)
// --------------------------------------
router.patch('/:id/stage', (0, validate_1.validate)(dto_1.UpdateDealStageSchema), index_1.dealsController.updateStage);
// --------------------------------------
// Get a single deal by ID
// --------------------------------------
router.get('/:id', index_1.dealsController.findById);
exports.default = router;
