// src/modules/contacts/contacts.repo.ts

import { prisma, Contact, Prisma } from '../../core/db';
import { IContactsRepository, CreateContactInput, UpdateContactInput } from './contacts.repo.interface';
import { BaseRepository } from '../../core/base.repository';

export class ContactsRepository extends BaseRepository<Contact, CreateContactInput, UpdateContactInput> implements IContactsRepository {
  constructor() {
    super('contact');
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

  async createTx(
    tx: Prisma.TransactionClient,
    data: {
      tenantId: string;
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }
  ): Promise<Contact> {
    return tx.contact.create({
      data,
    });
  }
}
