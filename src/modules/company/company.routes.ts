// src/modules/company/company.routes.ts

import { Router } from 'express';
import { companyController } from './index';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { CreateCompanySchema, UpdateCompanySchema } from './dto';

const router = Router();

// All routes require auth
router.use(authenticate);

// --------------------------------------
// Create company
// --------------------------------------
router.post('/', validate(CreateCompanySchema), companyController.create);

// --------------------------------------
// Get all companies
// --------------------------------------
router.get('/', companyController.getAll);

// --------------------------------------
// Get single company by ID
// --------------------------------------
router.get('/:id', companyController.getById);

// --------------------------------------
// Update company
// --------------------------------------
router.patch('/:id', validate(UpdateCompanySchema), companyController.update);

// --------------------------------------
// Delete company (hard delete)
// --------------------------------------
router.delete('/:id', companyController.delete);

export default router;
