"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const auth_1 = require("../../middlewares/auth");
const rbac_1 = require("../../middlewares/rbac");
const router = (0, express_1.Router)();
// All audit routes require authentication
router.use(auth_1.authenticate);
// --------------------------------------
// Get all audit logs (supports filters)
// --------------------------------------
router.get('/', rbac_1.requiresAdmin, index_1.auditController.find);
// --------------------------------------
// Get single audit log by ID
// --------------------------------------
router.get('/:id', index_1.auditController.findById);
exports.default = router;
