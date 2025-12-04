// src/modules/users/user.routes.ts

import { Router } from 'express';
import { userController } from './index';
import { validate } from '../../middlewares/validate';
import { CreateUserSchema, UpdateUserSchema } from './dto';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require auth
router.use(authenticate);

// --------------------------------------
// Create a user
// --------------------------------------
router.post('/', validate(CreateUserSchema), userController.create);

// --------------------------------------
// Get all users in tenant
// --------------------------------------
router.get('/', userController.findAll);

// --------------------------------------
// Get single user
// --------------------------------------
router.get('/:id', userController.findById);

// --------------------------------------
// Update user
// --------------------------------------
router.put('/:id', validate(UpdateUserSchema), userController.update);

// --------------------------------------
// Deactivate (soft delete) user
// --------------------------------------
router.patch('/:id/deactivate', userController.deactivate);

// --------------------------------------
// Hard delete user
// --------------------------------------
router.delete('/:id', userController.delete);

export default router;
