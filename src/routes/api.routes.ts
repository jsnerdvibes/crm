import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/users.routes';
import leadRoutes from '../modules/lead/leads.routes';
import dealRoutes from '../modules/deal/deal.routes';
import companyRoutes from '../modules/company/company.routes';
import contactRoutes from '../modules/contact/contacts.routes';
import activityRoutes from '../modules/activity/activity.routes';
import auditRoutes from '../modules/audit/audit.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import settingsRoutes from '../modules/setting/setting.routes';
import { AuthRequest } from '../types/authRequest';
import { authenticate } from '../middlewares/auth';
import { requiresAdmin } from '../middlewares/rbac';

export const apiRoutes = Router();

// Auth Routes
apiRoutes.use('/auth', authRoutes);

// User Routes
apiRoutes.use('/users', userRoutes);

// Lead Routes
apiRoutes.use('/leads', leadRoutes);

// Contact Routes
apiRoutes.use('/contacts', contactRoutes);

// Company Routes
apiRoutes.use('/companies', companyRoutes);

// Deal Routes
apiRoutes.use('/deals', dealRoutes);

// Activity Routes
apiRoutes.use('/activities', activityRoutes);

// Audit Routes
apiRoutes.use('/audit-logs', auditRoutes);

// Dashboard Routes
apiRoutes.use('/dashboard', dashboardRoutes);

// Settings Routes
apiRoutes.use('/settings', settingsRoutes);

// Test Routes

apiRoutes.get('/protected', authenticate, (req, res) => {
  const user = (req as AuthRequest).user;

  res.json({
    message: 'Access granted',
    user,
  });
});

apiRoutes.get('/admin-only', authenticate, requiresAdmin, (req, res) => {
  const user = (req as AuthRequest).user;

  res.json({
    message: 'Admin access granted',
    user,
  });
});
