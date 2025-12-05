import { Company } from '../../core/db';

export interface ICompanyRepository {
  create(
    tenantId: string,
    data: {
      name: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
    }
  ): Promise<Company>;

  findById(tenantId: string, companyId: string): Promise<Company | null>;

  findAll(tenantId: string): Promise<Company[]>;

  findByName(tenantId: string, name: string): Promise<Company | null>;

  update(
    tenantId: string,
    companyId: string,
    data: Partial<{
      name: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
    }>
  ): Promise<Company>;

  delete(tenantId: string, companyId: string): Promise<void>;
}
