"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const db_1 = require("../../core/db");
class CompanyRepository {
    // Create a new company inside tenant
    async create(tenantId, data) {
        return db_1.prisma.company.create({
            data: {
                tenantId,
                ...data,
            },
        });
    }
    // Find a company by ID within tenant
    async findById(tenantId, companyId) {
        return db_1.prisma.company.findFirst({
            where: {
                id: companyId,
                tenantId,
            },
        });
    }
    // Find company by name (for duplicates)
    async findByName(tenantId, name) {
        return db_1.prisma.company.findFirst({
            where: {
                name,
                tenantId,
            },
        });
    }
    // Find all companies belonging to tenant
    async findAll(tenantId) {
        return db_1.prisma.company.findMany({
            where: {
                tenantId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    // Update company fields
    async update(tenantId, companyId, data) {
        await db_1.prisma.company.updateMany({
            where: {
                id: companyId,
                tenantId,
            },
            data,
        });
        const company = await this.findById(tenantId, companyId);
        if (!company)
            throw new Error('Company not found');
        return company;
    }
    // Delete a company (hard delete)
    async delete(tenantId, companyId) {
        await db_1.prisma.company.deleteMany({
            where: {
                id: companyId,
                tenantId,
            },
        });
    }
}
exports.CompanyRepository = CompanyRepository;
