"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../core/db");
const error_1 = require("../core/error");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new error_1.UnauthorizedError('Missing token');
        }
        const token = authHeader.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwt.secret);
        // FIX HERE — use decoded.sub
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.sub },
        });
        if (!user) {
            throw new error_1.UnauthorizedError('Invalid User');
        }
        req.user = {
            id: decoded.sub,
            tenantId: decoded.tenantId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        throw new error_1.UnauthorizedError('Invalid User');
    }
};
exports.authenticate = authenticate;
