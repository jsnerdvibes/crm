"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_1 = require("../core/error");
const sanitize_1 = require("../utils/sanitize");
const validate = (schema) => (req, _res, next) => {
    // sanitize request
    req.body = (0, sanitize_1.sanitizeObject)(req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const zodError = result.error;
        const errors = zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return next(new error_1.UnprocessableEntityError('Validation failed', errors));
    }
    // sanitize the validated data
    req.body = (0, sanitize_1.sanitizeObject)(result.data);
    next();
};
exports.validate = validate;
