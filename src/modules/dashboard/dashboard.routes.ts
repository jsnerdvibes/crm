import { Router } from 'express';
import { dashboardController } from './index';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/pipeline', dashboardController.getPipeline);
router.get('/totals', dashboardController.getTotals);
router.get('/activities', dashboardController.getActivities);

export default router;
