import { Router } from 'express';
import { auditController } from './index';
import { authenticate } from '../../middlewares/auth';
import { requiresAdmin } from '../../middlewares/rbac';

const router = Router();

// All audit routes require authentication
router.use(authenticate);


// --------------------------------------
// Get all audit logs (supports filters)
// --------------------------------------
router.get('/', requiresAdmin, auditController.find);


// --------------------------------------
// Get single audit log by ID
// --------------------------------------
router.get('/:id', auditController.findById);


export default router;
