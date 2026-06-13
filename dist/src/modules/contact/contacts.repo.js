"use strict";
// src/modules/contacts/contacts.repo.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsRepository = void 0;
const db_1 = require("../../core/db");
const base_repository_1 = require("../../core/base.repository");
class ContactsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('contact');
    }
    // -----------------------------
    // Find by email
    // -----------------------------
    async findByEmail(tenantId, email) {
        return db_1.prisma.contact.findFirst({
            where: { email, tenantId },
        });
    }
    // -----------------------------
    // Get all contacts for tenant
    // -----------------------------
    async findAll(tenantId) {
        return db_1.prisma.contact.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTx(tx, data) {
        return tx.contact.create({
            data,
        });
    }
}
exports.ContactsRepository = ContactsRepository;
