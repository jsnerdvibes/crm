import { prisma, Company } from '../../core/db';
import { ICompanyRepository, CreateCompanyInput, UpdateCompanyInput } from './company.repo.interface';
import { BaseRepository } from '../../core/base.repository';

export class CompanyRepository extends BaseRepository<Company, CreateCompanyInput, UpdateCompanyInput> implements ICompanyRepository {
  constructor() {
    super('company');
  }

  // Find company by name (for duplicates)
  async findByName(tenantId: string, name: string): Promise<Company | null> {
    return prisma.company.findFirst({
      where: {
        name,
        tenantId,
      },
    });
  }

  // Find all companies belonging to tenant
  async findAll(tenantId: string): Promise<Company[]> {
    return prisma.company.findMany({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
