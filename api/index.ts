import { app } from '../src/app';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Wrap Express app for Vercel
export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req, res);
}
