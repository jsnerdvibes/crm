import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';

export const apiRoutes = Router();

// Mount Auth module
apiRoutes.use('/auth', authRoutes);

// Future modules
// apiRoutes.use('/users', userRoutes);
// apiRoutes.use('/leads', leadRoutes);
