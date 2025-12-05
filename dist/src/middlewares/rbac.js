"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresAdmin = exports.requiresRole = void 0;
const error_1 = require("../core/error");
const requiresRole = (role) => {
    return (req, res, next) => {
        if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== role) {
            throw new error_1.ForbiddenError('Access denied');
        }
        next();
    };
};
exports.requiresRole = requiresRole;
exports.requiresAdmin = (0, exports.requiresRole)('ADMIN');
