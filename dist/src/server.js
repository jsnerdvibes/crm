"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./core/logger");
const server = http_1.default.createServer(app_1.app);
server.listen(config_1.config.app.port, () => {
    logger_1.logger.info(`🚀 Server running on port ${config_1.config.app.port}`);
});
// Graceful shutdown (optional for now)
process.on('SIGINT', () => {
    logger_1.logger.info('Server shutting down...');
    process.exit(0);
});
