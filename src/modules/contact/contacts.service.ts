// modules/contacts/contacts.service.ts
import { IContactsRepository } from './contacts.repo.interface';
import { CreateContactDTO, UpdateContactDTO, ContactResponse } from './dto';
import { Contact } from '../../core/db';
import { NotFoundError, BadRequestError } from '../../core/error';
import { logger } from '../../core/logger';
import { logAudit } from '../../utils/audit.log';
import { LogActions, LogResources } from '../../types/logActions';

export class ContactsService {
  constructor(private repo: IContactsRepository) {}

  // -------------------------
  // Create a new contact
  // -------------------------
  async createContact(
    tenantId: string,
    data: CreateContactDTO,
    performedById?: string
  ): Promise<ContactResponse> {
    // Check if email already exists (if provided)
    if (data.email) {
      const existing = await this.repo.findByEmail(tenantId, data.email);
      if (existing) {
        throw new BadRequestError('Email already exists');
      }
    }

    const contact = await this.repo.create(tenantId, data);

    const sanitized = this.sanitize(contact);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.CREATE,
      LogResources.CONTACT,
      contact.id,
      { title: `${contact.firstName} ${contact.lastName}` }
    );

    return sanitized;
  }

  // -------------------------
  // Update existing contact
  // -------------------------
  async updateContact(
    tenantId: string,
    contactId: string,
    data: UpdateContactDTO,
    performedById?: string
  ): Promise<ContactResponse> {
    const existing = await this.repo.findById(tenantId, contactId);
    if (!existing) throw new NotFoundError('Contact not found');

    // Optional: Check email uniqueness if email is updated
    if (data.email && data.email !== existing.email) {
      const emailExists = await this.repo.findByEmail(tenantId, data.email);
      if (emailExists) throw new BadRequestError('Email already exists');
    }

    const updated = await this.repo.update(tenantId, contactId, data);

    const sanitized = this.sanitize(updated);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.UPDATE,
      LogResources.CONTACT,
      updated.id,
      { title: `${updated.firstName} ${updated.lastName}` }
    );

    return sanitized;
  }

  // -------------------------
  // Delete contact
  // -------------------------
  async deleteContact(
    tenantId: string,
    contactId: string,
    performedById?: string
  ): Promise<void> {
    const contact = await this.repo.findById(tenantId, contactId);
    if (!contact) throw new NotFoundError('Contact not found');

    await this.repo.delete(tenantId, contactId);
    logger.info(`Contact ${contactId} deleted from tenant ${tenantId}`);

    // log audit
    await logAudit(
      tenantId,
      performedById,
      LogActions.UPDATE,
      LogResources.CONTACT,
      contact.id,
      { title: `${contact.firstName} ${contact.lastName}` }
    );
  }

  // -------------------------
  // Get single contact
  // -------------------------
  async getContactById(
    tenantId: string,
    contactId: string
  ): Promise<ContactResponse> {
    const contact = await this.repo.findById(tenantId, contactId);
    if (!contact) throw new NotFoundError('Contact not found');
    return this.sanitize(contact);
  }

  // -------------------------
  // Get all contacts for a tenant
  // -------------------------
  async getAllContacts(tenantId: string): Promise<ContactResponse[]> {
    const contacts = await this.repo.findAll(tenantId);
    return contacts.map(this.sanitize);
  }

  // -------------------------
  // Helper: sanitize contact for response
  // -------------------------
  private sanitize(contact: Contact): ContactResponse {
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
