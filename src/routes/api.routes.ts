import { Router } from 'express';
import { validate } from '../middlewares/validate';
import { RegisterSchema } from '../modules/auth/dto';
import authRoutes from '../modules/auth/auth.routes';

export const apiRoutes = Router();

// Mount Auth module
apiRoutes.use('/auth', validate(RegisterSchema), authRoutes);

// Future modules
// apiRoutes.use('/users', userRoutes);
// apiRoutes.use('/leads', leadRoutes);
