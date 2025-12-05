"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const error_1 = require("../core/error");
const response_1 = require("../utils/response");
const logger_1 = require("../core/logger");
const config_1 = require("../config");
function errorHandler(err, req, res, next) {
    // Log error (can replace with pino/winston)
    logger_1.logger.error(err);
    let statusCode = 500;
    let message = 'Something went wrong';
    let errors = [];
    if (err instanceof error_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
        const errors = err.errors || [];
        return res.status(statusCode).json({
            ...(0, response_1.errorResponse)(message, errors),
            ...(config_1.config.app.env === 'development' && { stack: err.stack }),
        });
    }
    res.status(statusCode).json((0, response_1.errorResponse)(message, errors));
}
