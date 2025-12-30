import { Router } from 'express';
import { dealsController } from './index';
import { validate } from '../../middlewares/validate';
import {
  CreateDealSchema,
  UpdateDealSchema,
  UpdateDealStageSchema,
} from './dto';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// --------------------------------------
// Get all deals (with optional filters)
// --------------------------------------
router.get('/', dealsController.findAll);

// --------------------------------------
// Create a new deal
// --------------------------------------
router.post('/', validate(CreateDealSchema), dealsController.create);

// --------------------------------------
// Update a deal by ID
// --------------------------------------
router.patch('/:id', validate(UpdateDealSchema), dealsController.update);

// --------------------------------------
// Delete a deal by ID
// --------------------------------------
router.delete('/:id', dealsController.delete);

// --------------------------------------
// Assign deal to a user
// --------------------------------------
router.patch('/:id/assign', dealsController.assignDeal);

// --------------------------------------
// Update deal stage (pipeline movement)
// --------------------------------------
router.patch(
  '/:id/stage',
  validate(UpdateDealStageSchema),
  dealsController.updateStage
);

// --------------------------------------
// Get a single deal by ID
// --------------------------------------
router.get('/:id', dealsController.findById);

export default router;
