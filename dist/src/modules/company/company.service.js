"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const error_1 = require("../../core/error");
const audit_log_1 = require("../../utils/audit.log");
const logActions_1 = require("../../types/logActions");
class CompanyService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------
    // Create a new company
    // -------------------------
    async createCompany(tenantId, data, performedById) {
        // Check duplicate name
        const existing = await this.repo.findByName(tenantId, data.name);
        if (existing) {
            throw new error_1.BadRequestError('Company with this name already exists');
        }
        const company = await this.repo.create(tenantId, data);
        const sanitized = this.sanitize(company);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.CREATE, logActions_1.LogResources.COMPANY, company.id, { title: company.name });
        return sanitized;
    }
    // -------------------------
    // Update company
    // -------------------------
    async updateCompany(tenantId, companyId, data, performedById) {
        const company = await this.repo.findById(tenantId, companyId);
        if (!company)
            throw new error_1.NotFoundError('Company not found');
        // If name is changing, check duplicates
        if (data.name && data.name !== company.name) {
            const existing = await this.repo.findByName(tenantId, data.name);
            if (existing) {
                throw new error_1.BadRequestError('Another company with this name already exists');
            }
        }
        const updatedCompany = await this.repo.update(tenantId, companyId, data);
        const sanitized = this.sanitize(updatedCompany);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.COMPANY, updatedCompany.id, { title: updatedCompany.name });
        return sanitized;
    }
    // -------------------------
    // Delete company
    // -------------------------
    async deleteCompany(tenantId, companyId, performedById) {
        const company = await this.repo.findById(tenantId, companyId);
        if (!company)
            throw new error_1.NotFoundError('Company not found');
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.DELETE, logActions_1.LogResources.COMPANY, company.id, { title: company.name });
        await this.repo.delete(tenantId, companyId);
    }
    // -------------------------
    // Get single company
    // -------------------------
    async getCompanyById(tenantId, companyId) {
        const company = await this.repo.findById(tenantId, companyId);
        if (!company)
            throw new error_1.NotFoundError('Company not found');
        return this.sanitize(company);
    }
    // -------------------------
    // Get all companies
    // -------------------------
    async getAllCompanies(tenantId) {
        const companies = await this.repo.findAll(tenantId);
        return companies.map((company) => this.sanitize(company));
    }
    // -------------------------
    // Helper: sanitize response
    // -------------------------
    sanitize(company) {
        return {
            id: company.id,
            name: company.name,
            website: company.website ?? null,
            phone: company.phone ?? null,
            address: company.address ?? null,
            createdAt: company.createdAt,
        };
    }
}
exports.CompanyService = CompanyService;
