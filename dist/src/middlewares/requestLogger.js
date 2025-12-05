"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const logger_1 = require("../core/logger");
const requestLogger = (req, res, next) => {
    const start = Date.now();
    // Log basic request info
    logger_1.logger.info({
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
    }, 'Incoming request');
    // Capture response time
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
        }, 'Request completed');
    });
    next();
};
exports.requestLogger = requestLogger;
