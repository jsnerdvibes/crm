"use strict";
// src/modules/contacts/contacts.repo.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsRepository = void 0;
const db_1 = require("../../core/db");
class ContactsRepository {
    // -----------------------------
    // Create a new contact
    // -----------------------------
    async create(tenantId, data) {
        return db_1.prisma.contact.create({
            data: {
                tenantId,
                ...data,
            },
        });
    }
    // -----------------------------
    // Find by ID
    // -----------------------------
    async findById(tenantId, contactId) {
        return db_1.prisma.contact.findFirst({
            where: { id: contactId, tenantId },
        });
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
    // -----------------------------
    // Update contact
    // -----------------------------
    async update(tenantId, contactId, data) {
        return db_1.prisma.contact
            .updateMany({
            where: { id: contactId, tenantId },
            data,
        })
            .then(async (res) => {
            if (res.count === 0) {
                throw new Error('Contact not found');
            }
            const contact = await this.findById(tenantId, contactId);
            if (!contact)
                throw new Error('Contact not found');
            return contact;
        });
    }
    // -----------------------------
    // Delete contact
    // -----------------------------
    async delete(tenantId, contactId) {
        await db_1.prisma.contact.deleteMany({
            where: { id: contactId, tenantId },
        });
    }
    async createTx(tx, data) {
        return tx.contact.create({
            data,
        });
    }
}
exports.ContactsRepository = ContactsRepository;
