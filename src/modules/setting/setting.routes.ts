// src/modules/setting/setting.routes.ts

import { Router } from 'express';
import { settingController } from './index';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.use(authenticate)

router.get('/', settingController.getAll);
router.get('/:key', settingController.getByKey);
router.patch('/:key', settingController.update);

export default router;
