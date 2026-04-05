"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startJobs = startJobs;
// src/jobs/jobRunner.ts
const logger_1 = require("../core/logger");
const reminderJob_1 = require("./reminderJob");
// Run reminder job every minute (for testing)
function startJobs() {
    logger_1.logger.info('[JobRunner] Starting background jobs...');
    setInterval(() => {
        (0, reminderJob_1.reminderJob)().catch((err) => logger_1.logger.error('[JobRunner] Error:', err));
    }, 10 * 1000); // every 60 seconds
}
