"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const db_1 = require("../../core/db");
const base_repository_1 = require("../../core/base.repository");
class CompanyRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('company');
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
}
exports.CompanyRepository = CompanyRepository;
