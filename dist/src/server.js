"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const config_1 = require("./config");
const db_1 = require("./core/db");
const logger_1 = require("./core/logger");
const server = http_1.default.createServer(app_1.app);
server.on('error', (error) => {
    logger_1.logger.error(error);
});
let isShuttingDown = false;
async function shutdown(signal) {
    if (isShuttingDown)
        return;
    isShuttingDown = true;
    logger_1.logger.info(`${signal} received. Server shutting down...`);
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
    await db_1.prisma.$disconnect();
}
async function bootstrap() {
    try {
        await db_1.prisma.$connect();
        server.listen(config_1.config.app.port, () => {
            logger_1.logger.info(`Server running on port ${config_1.config.app.port}`);
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        await db_1.prisma.$disconnect().catch(() => undefined);
        process.exit(1);
    }
}
process.on('SIGINT', () => {
    shutdown('SIGINT')
        .then(() => process.exit(0))
        .catch((error) => {
        logger_1.logger.error(error);
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    shutdown('SIGTERM')
        .then(() => process.exit(0))
        .catch((error) => {
        logger_1.logger.error(error);
        process.exit(1);
    });
});
void bootstrap();
