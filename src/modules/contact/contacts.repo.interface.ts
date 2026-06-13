import { Contact, Prisma } from '../../core/db';
import { IBaseRepository } from '../../core/base.repository';

export interface CreateContactInput {
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  companyId?: string | null;
}

export type UpdateContactInput = Partial<CreateContactInput>;

export interface IContactsRepository extends IBaseRepository<Contact, CreateContactInput, UpdateContactInput> {
  findByEmail(tenantId: string, email: string): Promise<Contact | null>;
  findAll(tenantId: string): Promise<Contact[]>;
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
