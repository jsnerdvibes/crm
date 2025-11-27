import http from 'http';
import { app } from './app';
import { config } from './config';
import { logger } from './core/logger';

const server = http.createServer(app);

server.listen(config.app.port, () => {
  logger.info(`🚀 Server running on port ${config.app.port}`);
});

// Graceful shutdown (optional for now)
process.on('SIGINT', () => {
  logger.info('Server shutting down...');
  process.exit(0);
});
