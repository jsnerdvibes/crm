import { Contact, Prisma } from '../../core/db';

export interface IContactsRepository {
  /**
   * Create a new contact under a tenant
   */
  create(
    tenantId: string,
    data: {
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }
  ): Promise<Contact>;

  /**
   * Find a contact by ID within a tenant
   */
  findById(tenantId: string, contactId: string): Promise<Contact | null>;

  /**
   * Find a contact by email within a tenant
   */
  findByEmail(tenantId: string, email: string): Promise<Contact | null>;

  /**
   * Get all contacts of a tenant
   */
  findAll(tenantId: string): Promise<Contact[]>;

  /**
   * Update a contact
   */
  update(
    tenantId: string,
    contactId: string,
    data: Partial<{
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }>
  ): Promise<Contact>;

  /**
   * Delete a contact
   */
  delete(tenantId: string, contactId: string): Promise<void>;

  /**
   * Create contact inside a transaction (used for lead conversion)
   */
  createTx(
    tx: Prisma.TransactionClient,
    data: {
      tenantId: string;
      firstName: string;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      companyId?: string | null;
    }
  ): Promise<Contact>;
}
