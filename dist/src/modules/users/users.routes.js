"use strict";
// src/modules/users/user.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const validate_1 = require("../../middlewares/validate");
const dto_1 = require("./dto");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// All routes require auth
router.use(auth_1.authenticate);
// --------------------------------------
// Create a user
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateUserSchema), index_1.userController.create);
// --------------------------------------
// Get all users in tenant
// --------------------------------------
router.get('/', index_1.userController.findAll);
// --------------------------------------
// Get single user
// --------------------------------------
router.get('/:id', index_1.userController.findById);
// --------------------------------------
// Update user
// --------------------------------------
router.put('/:id', (0, validate_1.validate)(dto_1.UpdateUserSchema), index_1.userController.update);
// --------------------------------------
// Deactivate (soft delete) user
// --------------------------------------
router.patch('/:id/deactivate', index_1.userController.deactivate);
// --------------------------------------
// Hard delete user
// --------------------------------------
router.delete('/:id', index_1.userController.delete);
exports.default = router;
