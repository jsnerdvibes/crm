import { Router } from 'express';
import { leadsController } from './index';
import { validate } from '../../middlewares/validate';
import { CreateLeadSchema, UpdateLeadSchema } from './dto';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// --------------------------------------
// Create a new lead
// --------------------------------------
router.post('/', validate(CreateLeadSchema), leadsController.create);

// --------------------------------------
// Get all leads (with optional filters)
// --------------------------------------
router.get('/', leadsController.findAll);

// --------------------------------------
// Get a single lead by ID
// --------------------------------------
router.get('/:id', leadsController.findById);

// --------------------------------------
// Update a lead by ID
// --------------------------------------
router.put('/:id', validate(UpdateLeadSchema), leadsController.update);

// --------------------------------------
// Delete a lead by ID
// --------------------------------------
router.delete('/:id', leadsController.delete);

export default router;
