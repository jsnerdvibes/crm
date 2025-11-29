// src/modules/auth/auth.routes.ts

import { Router } from 'express';
import { authController } from './index';
import { validate } from '../../middlewares/validate';
import { LoginSchema, RefreshTokenSchema, RegisterSchema } from './dto';

const router = Router();

router.post('/register', 
    validate(RegisterSchema), 
    authController.register);

router.post("/login", 
    validate(LoginSchema), 
    authController.login);

router.post('/refresh', 
    validate(RefreshTokenSchema), 
    authController.refresh);

router.post('/logout', 
    validate(RefreshTokenSchema),
    authController.logout);


export default router;
