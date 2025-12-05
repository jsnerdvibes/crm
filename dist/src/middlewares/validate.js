"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_1 = require("../core/error");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const zodError = result.error; // remove <any>, ZodError already generic
        const errors = zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
        return next(new error_1.UnprocessableEntityError('Validation failed', errors));
    }
    req.body = result.data; // sanitized
    next();
};
exports.validate = validate;
