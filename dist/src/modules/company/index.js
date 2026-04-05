"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyController = exports.companyService = exports.companyRepository = void 0;
const company_repo_1 = require("./company.repo");
const company_service_1 = require("./company.service");
const company_controller_1 = require("./company.controller");
exports.companyRepository = new company_repo_1.CompanyRepository();
exports.companyService = new company_service_1.CompanyService(exports.companyRepository);
exports.companyController = new company_controller_1.CompanyController(exports.companyService);
