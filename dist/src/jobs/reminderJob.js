"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderJob = reminderJob;
// src/jobs/reminderJob.ts
const db_1 = require("../core/db");
const logger_1 = require("../core/logger");
// Placeholder email function
function sendEmail(to, subject, body) {
    logger_1.logger.info(`Sending email to ${to} - Subject: ${subject} - Body: ${body}`);
}
// Reminder job: runs periodically to find due activities
async function reminderJob() {
    logger_1.logger.info('[ReminderJob] Running reminder job...');
    const now = new Date();
    const dueActivities = await db_1.prisma.activity.findMany({
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
    logger_1.logger.info(`[ReminderJob] Found ${dueActivities.length} due activities.`);
}
