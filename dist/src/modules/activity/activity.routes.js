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
// Get all activities (timeline, with filters)
// GET /activities?targetType=Lead&targetId=123
// --------------------------------------
router.get('/', index_1.activitiesController.findAll);
// --------------------------------------
// Create a new activity
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateActivitySchema), index_1.activitiesController.create);
// --------------------------------------
// Update an activity by ID
// --------------------------------------
router.patch('/:id', (0, validate_1.validate)(dto_1.UpdateActivitySchema), index_1.activitiesController.update);
// --------------------------------------
// Delete an activity by ID
// --------------------------------------
router.delete('/:id', index_1.activitiesController.delete);
// --------------------------------------
// Get a single activity by ID
// --------------------------------------
router.get('/:id', index_1.activitiesController.findById);
exports.default = router;
