"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactsService = void 0;
const error_1 = require("../../core/error");
const logger_1 = require("../../core/logger");
const audit_log_1 = require("../../utils/audit.log");
const logActions_1 = require("../../types/logActions");
class ContactsService {
    constructor(repo) {
        this.repo = repo;
    }
    // -------------------------
    // Create a new contact
    // -------------------------
    async createContact(tenantId, data, performedById) {
        // Check if email already exists (if provided)
        if (data.email) {
            const existing = await this.repo.findByEmail(tenantId, data.email);
            if (existing) {
                throw new error_1.BadRequestError('Email already exists');
            }
        }
        const contact = await this.repo.create(tenantId, data);
        const sanitized = this.sanitize(contact);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.CREATE, logActions_1.LogResources.CONTACT, contact.id, { title: `${contact.firstName} ${contact.lastName}` });
        return sanitized;
    }
    // -------------------------
    // Update existing contact
    // -------------------------
    async updateContact(tenantId, contactId, data, performedById) {
        const existing = await this.repo.findById(tenantId, contactId);
        if (!existing)
            throw new error_1.NotFoundError('Contact not found');
        // Optional: Check email uniqueness if email is updated
        if (data.email && data.email !== existing.email) {
            const emailExists = await this.repo.findByEmail(tenantId, data.email);
            if (emailExists)
                throw new error_1.BadRequestError('Email already exists');
        }
        const updated = await this.repo.update(tenantId, contactId, data);
        const sanitized = this.sanitize(updated);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.CONTACT, updated.id, { title: `${updated.firstName} ${updated.lastName}` });
        return sanitized;
    }
    // -------------------------
    // Delete contact
    // -------------------------
    async deleteContact(tenantId, contactId, performedById) {
        const contact = await this.repo.findById(tenantId, contactId);
        if (!contact)
            throw new error_1.NotFoundError('Contact not found');
        await this.repo.delete(tenantId, contactId);
        logger_1.logger.info(`Contact ${contactId} deleted from tenant ${tenantId}`);
        // log audit
        await (0, audit_log_1.logAudit)(tenantId, performedById, logActions_1.LogActions.UPDATE, logActions_1.LogResources.CONTACT, contact.id, { title: `${contact.firstName} ${contact.lastName}` });
    }
    // -------------------------
    // Get single contact
    // -------------------------
    async getContactById(tenantId, contactId) {
        const contact = await this.repo.findById(tenantId, contactId);
        if (!contact)
            throw new error_1.NotFoundError('Contact not found');
        return this.sanitize(contact);
    }
    // -------------------------
    // Get all contacts for a tenant
    // -------------------------
    async getAllContacts(tenantId) {
        const contacts = await this.repo.findAll(tenantId);
        return contacts.map(this.sanitize);
    }
    // -------------------------
    // Helper: sanitize contact for response
    // -------------------------
    sanitize(contact) {
        return {
            id: contact.id,
            companyId: contact.companyId ?? null,
            firstName: contact.firstName,
            lastName: contact.lastName ?? null,
            email: contact.email ?? null,
            phone: contact.phone ?? null,
            createdAt: contact.createdAt,
        };
    }
}
exports.ContactsService = ContactsService;
