import rateLimit from 'express-rate-limit';
import { config } from '../config';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.app.env === 'test' ? 10000 : 10, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
    data: {},
    errors: [],
  },
});
