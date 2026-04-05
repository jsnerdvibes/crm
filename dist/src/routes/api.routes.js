"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("../modules/user/users.routes"));
const leads_routes_1 = __importDefault(require("../modules/lead/leads.routes"));
const deal_routes_1 = __importDefault(require("../modules/deal/deal.routes"));
const company_routes_1 = __importDefault(require("../modules/company/company.routes"));
const contacts_routes_1 = __importDefault(require("../modules/contact/contacts.routes"));
const activity_routes_1 = __importDefault(require("../modules/activity/activity.routes"));
const audit_routes_1 = __importDefault(require("../modules/audit/audit.routes"));
const dashboard_routes_1 = __importDefault(require("../modules/dashboard/dashboard.routes"));
const setting_routes_1 = __importDefault(require("../modules/setting/setting.routes"));
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
exports.apiRoutes = (0, express_1.Router)();
// Auth Routes
exports.apiRoutes.use('/auth', auth_routes_1.default);
// User Routes
exports.apiRoutes.use('/users', users_routes_1.default);
// Lead Routes
exports.apiRoutes.use('/leads', leads_routes_1.default);
// Contact Routes
exports.apiRoutes.use('/contacts', contacts_routes_1.default);
// Company Routes
exports.apiRoutes.use('/companies', company_routes_1.default);
// Deal Routes
exports.apiRoutes.use('/deals', deal_routes_1.default);
// Activity Routes
exports.apiRoutes.use('/activities', activity_routes_1.default);
// Audit Routes
exports.apiRoutes.use('/audit-logs', audit_routes_1.default);
// Dashboard Routes
exports.apiRoutes.use('/dashboard', dashboard_routes_1.default);
// Settings Routes
exports.apiRoutes.use('/settings', setting_routes_1.default);
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
