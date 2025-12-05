"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("../modules/users/users.routes"));
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
exports.apiRoutes = (0, express_1.Router)();
// Auth Routes
exports.apiRoutes.use('/auth', auth_routes_1.default);
// User Routes
exports.apiRoutes.use('/users', users_routes_1.default);
// Future modules
// apiRoutes.use('/users', userRoutes);
// apiRoutes.use('/leads', leadRoutes);
// Test Routes
exports.apiRoutes.get('/protected', auth_1.authenticate, (req, res) => {
    const user = req.user;
    res.json({
        message: 'Access granted',
        user,
    });
});
exports.apiRoutes.get('/admin-only', auth_1.authenticate, rbac_1.requiresAdmin, (req, res) => {
    const user = req.user;
    res.json({
        message: 'Admin access granted',
        user,
    });
});
