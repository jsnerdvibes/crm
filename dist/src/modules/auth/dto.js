"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSchema = zod_1.z.object({
    tenantName: zod_1.z.string().min(1, { message: 'Tenant name is required' }),
    email: zod_1.z.email({ message: 'Valid email is required' }),
    password: zod_1.z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.email({ message: 'Valid email is required' }),
    password: zod_1.z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, { message: 'Refresh token is required' }),
});
