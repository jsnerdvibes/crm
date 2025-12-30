import fs from 'fs';
import path from 'path';
import pino from 'pino';
import { config } from '../config';

// Create transport only in development
let transport;

if (config.app.env !== 'production') {
  const logDir = path.resolve(__dirname, '../../logs');

  // Ensure logs folder exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'app.logs');

  transport = pino.transport({
    target: 'pino/file',
    options: {
      destination: logFile,
      mkdir: true,
    },
  });
}

// Production → no transport (console only)
export const logger = pino(
  {
    level: config.app.env === 'production' ? 'info' : 'debug',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  transport // dev → file, prod → console
);
