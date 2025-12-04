import { NextFunction, Response } from 'express';
import { ForbiddenError } from '../core/error';
import { AuthRequest } from '../types/authRequest';

export const requiresRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== role) {
      throw new ForbiddenError('Access denied');
    }
    next();
  };
};

export const requiresAdmin = requiresRole('ADMIN');
