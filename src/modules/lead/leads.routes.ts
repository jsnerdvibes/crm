import { Router } from 'express';
import { leadsController } from './index';
import { validate } from '../../middlewares/validate';
import { CreateLeadSchema, UpdateLeadSchema } from './dto';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);


// --------------------------------------
// Get all leads (with optional filters)
// --------------------------------------

router.get("/", leadsController.findAll);




// --------------------------------------
// Create a new lead
// --------------------------------------
router.post('/', validate(CreateLeadSchema), leadsController.create);


// --------------------------------------
// Convert lead → contact + deal
// --------------------------------------
router.post('/:id/convert', leadsController.convertLead);



// --------------------------------------
// Update a lead by ID
// --------------------------------------
router.patch('/:id', validate(UpdateLeadSchema), leadsController.update);

// --------------------------------------
// Delete a lead by ID
// --------------------------------------
router.delete('/:id', leadsController.delete);


// Assign lead to a user
router.patch('/:id/assign', leadsController.assignLead);


// --------------------------------------
// Get a single lead by ID
// --------------------------------------
router.get('/:id', leadsController.findById);



export default router;
