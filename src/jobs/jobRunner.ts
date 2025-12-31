// src/jobs/jobRunner.ts
import { reminderJob } from './reminderJob';

// Run reminder job every minute (for testing)
export function startJobs() {
  console.log('[JobRunner] Starting background jobs...');
  setInterval(() => {
    reminderJob().catch((err) => console.error('[JobRunner] Error:', err));
  }, 10 * 1000); // every 60 seconds
}
