import { CompanyRepository } from './company.repo';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';

export const companyRepository = new CompanyRepository();
export const companyService = new CompanyService(companyRepository);
export const companyController = new CompanyController(companyService);
