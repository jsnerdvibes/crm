// src/modules/contacts/contacts.repo.ts

import { prisma, Contact } from '../../core/db';
import { IContactsRepository } from './contacts.repo.interface';

export class ContactsRepository implements IContactsRepository {
  // -----------------------------
  // Create a new contact
  // -----------------------------
  async create(
    tenantId: string,
    data: {
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }
  ): Promise<Contact> {
    return prisma.contact.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  // -----------------------------
  // Find by ID
  // -----------------------------
  async findById(tenantId: string, contactId: string): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: { id: contactId, tenantId },
    });
  }

  // -----------------------------
  // Find by email
  // -----------------------------
  async findByEmail(tenantId: string, email: string): Promise<Contact | null> {
    return prisma.contact.findFirst({
      where: { email, tenantId },
    });
  }

  // -----------------------------
  // Get all contacts for tenant
  // -----------------------------
  async findAll(tenantId: string): Promise<Contact[]> {
    return prisma.contact.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // -----------------------------
  // Update contact
  // -----------------------------
  async update(
    tenantId: string,
    contactId: string,
    data: Partial<{
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }>
  ): Promise<Contact> {
    return prisma.contact
      .updateMany({
        where: { id: contactId, tenantId },
        data,
      })
      .then(async (res) => {
        if (res.count === 0) {
          throw new Error('Contact not found');
        }

        const contact = await this.findById(tenantId, contactId);
        if (!contact) throw new Error('Contact not found');

        return contact;
      });
  }

  // -----------------------------
  // Delete contact
  // -----------------------------
  async delete(tenantId: string, contactId: string): Promise<void> {
    await prisma.contact.deleteMany({
      where: { id: contactId, tenantId },
    });
  }
}
