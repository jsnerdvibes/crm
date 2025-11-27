// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { authController } from './index';

const router = Router();

router.post('/register', authController.register);

export default router;
