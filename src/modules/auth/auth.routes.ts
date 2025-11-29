// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { authController } from './index';
import { validate } from '../../middlewares/validate';
import { LoginSchema, RegisterSchema } from './dto';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);

router.post("/login", validate(LoginSchema), authController.login);

export default router;
