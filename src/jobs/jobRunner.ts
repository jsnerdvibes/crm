// src/jobs/jobRunner.ts
import { logger } from '../core/logger';
import { reminderJob } from './reminderJob';

// Run reminder job every minute (for testing)
export function startJobs() {
  logger.info('[JobRunner] Starting background jobs...');
  setInterval(() => {
    reminderJob().catch((err) => logger.error('[JobRunner] Error:', err));
  }, 10 * 1000); // every 60 seconds
}
