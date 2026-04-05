"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeObject = void 0;
const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined)
        return obj;
    if (Array.isArray(obj)) {
        return obj.map((item) => (0, exports.sanitizeObject)(item));
    }
    if (typeof obj === 'object') {
        const sanitizedObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitizedObj[key] = (0, exports.sanitizeObject)(obj[key]);
            }
        }
        return sanitizedObj;
    }
    if (typeof obj === 'string') {
        return obj.replace(/<[^>]*>/g, '');
    }
    return obj;
};
exports.sanitizeObject = sanitizeObject;
