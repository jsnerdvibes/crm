import { Company } from '../../core/db';
import { IBaseRepository } from '../../core/base.repository';

export interface CreateCompanyInput {
  name: string;
  website?: string | null;
  phone?: string | null;
  address?: string | null;
}

export type UpdateCompanyInput = Partial<CreateCompanyInput>;

export interface ICompanyRepository extends IBaseRepository<Company, CreateCompanyInput, UpdateCompanyInput> {
  findAll(tenantId: string): Promise<Company[]>;
  findByName(tenantId: string, name: string): Promise<Company | null>;
}
