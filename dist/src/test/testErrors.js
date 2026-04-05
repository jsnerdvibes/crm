"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/test/testErrors.ts
const express_1 = __importDefault(require("express"));
const errorHandler_1 = require("../middlewares/errorHandler");
const error_1 = require("../core/error");
const logger_1 = require("../core/logger");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Routes to test different errors
app.get('/app-error', (_req, _res) => {
    throw new error_1.AppError('This is a generic app error', 501);
});
app.get('/not-found', (_req, _res) => {
    throw new error_1.NotFoundError('User not found');
});
app.get('/bad-Request', (_req, _res) => {
    throw new error_1.BadRequestError('Invalid Request data');
});
app.get('/unauthorized', (_req, _res) => {
    throw new error_1.UnauthorizedError('You are not authorized');
});
app.get('/forbidden', (_req, _res) => {
    throw new error_1.ForbiddenError('Access forbidden');
});
// Test a normal error (non-AppError)
app.get('/normal-error', (_req, _res) => {
    throw new Error('Some unexpected error');
});
// Global error handler must be the last middleware
app.use(errorHandler_1.errorHandler);
// Start server for testing
const PORT = 4001;
app.listen(PORT, () => {
    logger_1.logger.error(`Test server running on http://localhost:${PORT}`);
});
