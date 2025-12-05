"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const config_1 = require("../config");
// Create transport only in development
let transport;
if (config_1.config.app.env !== "production") {
    const logDir = path_1.default.resolve(__dirname, "../../logs");
    // Ensure logs folder exists
    if (!fs_1.default.existsSync(logDir)) {
        fs_1.default.mkdirSync(logDir, { recursive: true });
    }
    const logFile = path_1.default.join(logDir, "app.logs");
    transport = pino_1.default.transport({
        target: "pino/file",
        options: {
            destination: logFile,
            mkdir: true,
        },
    });
}
// Production → no transport (console only)
exports.logger = (0, pino_1.default)({
    level: config_1.config.app.env === "production" ? "info" : "debug",
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
}, transport // dev → file, prod → console
);
