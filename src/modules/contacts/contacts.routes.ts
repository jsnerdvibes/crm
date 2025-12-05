import { Router } from 'express';
import { contactsController } from './index';
import { validate } from '../../middlewares/validate';
import { CreateContactSchema, UpdateContactSchema } from './dto';
import { authenticate } from '../../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// --------------------------------------
// Create a new contact
// --------------------------------------
router.post('/', validate(CreateContactSchema), contactsController.create);

// --------------------------------------
// Get all contacts
// --------------------------------------
router.get('/', contactsController.getAll);

// --------------------------------------
// Get single contact by ID
// --------------------------------------
router.get('/:id', contactsController.getById);

// --------------------------------------
// Update contact
// --------------------------------------
router.patch('/:id', validate(UpdateContactSchema), contactsController.update);

// --------------------------------------
// Delete contact
// --------------------------------------
router.delete('/:id', contactsController.delete);

export default router;
