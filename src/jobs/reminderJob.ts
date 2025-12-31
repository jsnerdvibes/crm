// src/jobs/reminderJob.ts
import { prisma } from '../core/db';
import { logger } from '../core/logger';

// Placeholder email function
function sendEmail(to: string, subject: string, body: string) {
  logger.info(`Sending email to ${to} - Subject: ${subject} - Body: ${body}`);
}

// Reminder job: runs periodically to find due activities
export async function reminderJob() {
  logger.info('[ReminderJob] Running reminder job...');

  const now = new Date();

  const dueActivities = await prisma.activity.findMany({
    where: {
      completed: false,
      dueAt: { lte: now },
    },
    include: { actor: true },
  });

  dueActivities.forEach((activity) => {
    const email = activity.actor?.email || 'unknown';
    const subject = `Reminder: ${activity.type} is due`;
    const body = `Your activity "${activity.body || activity.type}" is due now.`;
    sendEmail(email, subject, body);
  });

  logger.info(`[ReminderJob] Found ${dueActivities.length} due activities.`);
}
