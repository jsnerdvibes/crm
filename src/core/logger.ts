import fs from 'fs';
import path from 'path';
import pino from 'pino';

// Ensure logs folder exists
const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log file path
const logFile = path.join(logDir, 'app.logs');

// Create Pino logger with file transport
export const logger = pino(
  {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
  },
  pino.destination(logFile) // writes logs to file
);
