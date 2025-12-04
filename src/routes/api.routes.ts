import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import { AuthRequest } from '../types/authRequest';
import { authenticate } from '../middlewares/auth';
import { requiresAdmin } from '../middlewares/rbac';

export const apiRoutes = Router();

// Mount Auth module
apiRoutes.use('/auth', authRoutes);

// Future modules
// apiRoutes.use('/users', userRoutes);
// apiRoutes.use('/leads', leadRoutes);



// Test Routes

apiRoutes.get("/protected", authenticate, (req, res) => {
  const user = (req as AuthRequest).user;

  res.json({
    message: "Access granted",
    user,
  });
});


apiRoutes.get("/admin-only", authenticate, requiresAdmin, (req, res) => {

const user = (req as AuthRequest).user;

  res.json({
    message: "Admin access granted",
    user,
  });
});