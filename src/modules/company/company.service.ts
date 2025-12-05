import { ICompanyRepository } from './company.repo.interface';
import {
  CreateCompanyDTO,
  UpdateCompanyDTO,
  CompanyResponse,
} from './dto';
import { Company } from '../../core/db';
import {
  BadRequestError,
  NotFoundError,
} from '../../core/error';
import { logger } from '../../core/logger';

export class CompanyService {
  constructor(private repo: ICompanyRepository) {}

  // -------------------------
  // Create a new company
  // -------------------------
  async createCompany(
    tenantId: string,
    data: CreateCompanyDTO
  ): Promise<CompanyResponse> {
    // Check duplicate name
    const existing = await this.repo.findByName(tenantId, data.name);
    if (existing) {
      throw new BadRequestError('Company with this name already exists');
    }

    const company = await this.repo.create(tenantId, data);
    return this.sanitize(company);
  }

  // -------------------------
  // Update company
  // -------------------------
  async updateCompany(
    tenantId: string,
    companyId: string,
    data: UpdateCompanyDTO
  ): Promise<CompanyResponse> {
    const company = await this.repo.findById(tenantId, companyId);
    if (!company) throw new NotFoundError('Company not found');

    // If name is changing, check duplicates
    if (data.name && data.name !== company.name) {
      const existing = await this.repo.findByName(tenantId, data.name);
      if (existing) {
        throw new BadRequestError('Another company with this name already exists');
      }
    }

    const updatedCompany = await this.repo.update(tenantId, companyId, data);
    return this.sanitize(updatedCompany);
  }

  // -------------------------
  // Delete company
  // -------------------------
  async deleteCompany(
    tenantId: string,
    companyId: string
  ): Promise<void> {
    const company = await this.repo.findById(tenantId, companyId);
    if (!company) throw new NotFoundError('Company not found');

    await this.repo.delete(tenantId, companyId);
    logger.info(`Company ${companyId} deleted successfully from tenant ${tenantId}`);
  }

  // -------------------------
  // Get single company
  // -------------------------
  async getCompanyById(
    tenantId: string,
    companyId: string
  ): Promise<CompanyResponse> {
    const company = await this.repo.findById(tenantId, companyId);
    if (!company) throw new NotFoundError('Company not found');
    return this.sanitize(company);
  }

  // -------------------------
  // Get all companies
  // -------------------------
  async getAllCompanies(tenantId: string): Promise<CompanyResponse[]> {
    const companies = await this.repo.findAll(tenantId);
    return companies.map((company) => this.sanitize(company));
  }

  // -------------------------
  // Helper: sanitize response
  // -------------------------
  private sanitize(company: Company): CompanyResponse {
    return {
      id: company.id,
      name: company.name,
      website: company.website ?? null,
      phone: company.phone ?? null,
      address: company.address ?? null,
      createdAt: company.createdAt,
    };
  }
}
