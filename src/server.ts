import http from 'http';
import { app } from './app';
import { config } from './config';
import { prisma } from './core/db';
import { logger } from './core/logger';

const server = http.createServer(app);

server.on('error', (error) => {
  logger.error(error);
});

let isShuttingDown = false;

async function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`${signal} received. Server shutting down...`);

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await prisma.$disconnect();
}

async function bootstrap() {
  try {
    await prisma.$connect();

    server.listen(config.app.port, () => {
      logger.info(`Server running on port ${config.app.port}`);
    });
  } catch (error) {
    logger.error(error);
    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  shutdown('SIGINT')
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM')
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    });
});

void bootstrap();
