"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditController = exports.auditService = exports.auditRepository = void 0;
const audit_repo_1 = require("./audit.repo");
const audit_service_1 = require("./audit.service");
const audit_controller_1 = require("./audit.controller");
exports.auditRepository = new audit_repo_1.AuditRepository();
exports.auditService = new audit_service_1.AuditService(exports.auditRepository);
exports.auditController = new audit_controller_1.AuditController(exports.auditService);
