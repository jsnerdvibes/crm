"use strict";
// src/modules/company/company.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const auth_1 = require("../../middlewares/auth");
const validate_1 = require("../../middlewares/validate");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
// All routes require auth
router.use(auth_1.authenticate);
// --------------------------------------
// Create company
// --------------------------------------
router.post('/', (0, validate_1.validate)(dto_1.CreateCompanySchema), index_1.companyController.create);
// --------------------------------------
// Get all companies
// --------------------------------------
router.get('/', index_1.companyController.getAll);
// --------------------------------------
// Get single company by ID
// --------------------------------------
router.get('/:id', index_1.companyController.getById);
// --------------------------------------
// Update company
// --------------------------------------
router.patch('/:id', (0, validate_1.validate)(dto_1.UpdateCompanySchema), index_1.companyController.update);
// --------------------------------------
// Delete company (hard delete)
// --------------------------------------
router.delete('/:id', index_1.companyController.delete);
exports.default = router;
