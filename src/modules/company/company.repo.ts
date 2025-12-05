import { prisma, Company } from '../../core/db';
import { ICompanyRepository } from './company.repo.interface';

export class CompanyRepository implements ICompanyRepository {
  // Create a new company inside tenant
  async create(
    tenantId: string,
    data: {
      name: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
    }
  ): Promise<Company> {
    return prisma.company.create({
      data: {
        tenantId,
        ...data,
      },
    });
  }

  // Find a company by ID within tenant
  async findById(tenantId: string, companyId: string): Promise<Company | null> {
    return prisma.company.findFirst({
      where: {
        id: companyId,
        tenantId,
      },
    });
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

  // Update company fields
  async update(
    tenantId: string,
    companyId: string,
    data: Partial<{
      name: string;
      website?: string | null;
      phone?: string | null;
      address?: string | null;
    }>
  ): Promise<Company> {
    await prisma.company.updateMany({
      where: {
        id: companyId,
        tenantId,
      },
      data,
    });

    const company = await this.findById(tenantId, companyId);
    if (!company) throw new Error('Company not found');
    return company;
  }

  // Delete a company (hard delete)
  async delete(tenantId: string, companyId: string): Promise<void> {
    await prisma.company.deleteMany({
      where: {
        id: companyId,
        tenantId,
      },
    });
  }
}
