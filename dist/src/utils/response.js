"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
const successResponse = (message, data = {}) => ({
    status: 'success',
    message,
    data,
    errors: [],
});
exports.successResponse = successResponse;
const errorResponse = (message, errors = []) => ({
    status: 'error',
    message,
    data: {},
    errors,
});
exports.errorResponse = errorResponse;
