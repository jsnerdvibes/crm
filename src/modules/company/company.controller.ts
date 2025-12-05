import { Response, NextFunction } from 'express';
import { CompanyService } from './company.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';

export class CompanyController {
  constructor(private service: CompanyService) {}

  // --------------------------------------
  // Create company
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/companies:
 *   post:
 *     summary: Create a new company within the tenant
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corp"
 *               website:
 *                 type: string
 *                 example: "https://www.acme.com"
 *               phone:
 *                 type: string
 *                 example: "+1-202-555-0156"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Springfield"
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Company created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-created-company"
 *                     name:
 *                       type: string
 *                       example: "Acme Corp"
 *                     website:
 *                       type: string
 *                       example: "https://www.acme.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0156"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, Springfield"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T10:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Validation errors (e.g., missing name or invalid website/phone)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "name"
 *                       message:
 *                         type: string
 *                         example: "Name is required"
 *       403:
 *         description: Forbidden (e.g., unauthorized tenant access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;

      const result = await this.service.createCompany(tenantId, req.body);

      return res
        .status(201)
        .json(successResponse('Company created successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Update company
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/companies/{id}:
 *   patch:
 *     summary: Update an existing company within the tenant
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the company to update
 *         schema:
 *           type: string
 *           example: "uuid-of-company"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Acme Corp Updated"
 *               website:
 *                 type: string
 *                 example: "https://www.acme-updated.com"
 *               phone:
 *                 type: string
 *                 example: "+1-202-555-0199"
 *               address:
 *                 type: string
 *                 example: "456 New St, Springfield"
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-company"
 *                     name:
 *                       type: string
 *                       example: "Acme Corp Updated"
 *                     website:
 *                       type: string
 *                       example: "https://www.acme-updated.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0199"
 *                     address:
 *                       type: string
 *                       example: "456 New St, Springfield"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Validation errors (e.g., invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "name"
 *                       message:
 *                         type: string
 *                         example: "Name must not be empty"
 *       403:
 *         description: Forbidden (e.g., unauthorized tenant access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const companyId = req.params.id;

      const updated = await this.service.updateCompany(
        tenantId,
        companyId,
        req.body
      );

      return res.json(
        successResponse('Company updated successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Delete company
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/companies/{id}:
 *   delete:
 *     summary: Delete a company within the tenant
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the company to delete
 *         schema:
 *           type: string
 *           example: "uuid-of-company"
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Company deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., unauthorized tenant access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const companyId = req.params.id;

      await this.service.deleteCompany(tenantId, companyId);

      return res.json(successResponse('Company deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get company by ID
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/companies/{id}:
 *   get:
 *     summary: Get a single company by ID within the tenant
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: UUID of the company to fetch
 *         schema:
 *           type: string
 *           example: "uuid-of-company"
 *     responses:
 *       200:
 *         description: Company fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Company fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-company"
 *                     name:
 *                       type: string
 *                       example: "Acme Corp"
 *                     website:
 *                       type: string
 *                       example: "https://www.acme.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0199"
 *                     address:
 *                       type: string
 *                       example: "123 Main St, Springfield"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T10:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., unauthorized tenant access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Company not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const companyId = req.params.id;

      const company = await this.service.getCompanyById(tenantId, companyId);

      return res.json(successResponse('Company fetched successfully', company));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get all companies
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/companies:
 *   get:
 *     summary: Get all companies within the tenant
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Companies fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Companies fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "uuid-of-company"
 *                       name:
 *                         type: string
 *                         example: "Acme Corp"
 *                       website:
 *                         type: string
 *                         example: "https://www.acme.com"
 *                       phone:
 *                         type: string
 *                         example: "+1-202-555-0199"
 *                       address:
 *                         type: string
 *                         example: "123 Main St, Springfield"
 *                       tenantId:
 *                         type: string
 *                         example: "uuid-of-tenant"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-05T10:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-05T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., unauthorized tenant access)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Forbidden"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 */

  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;

      const companies = await this.service.getAllCompanies(tenantId);

      return res.json(
        successResponse('Companies fetched successfully', companies)
      );
    } catch (error) {
      next(error);
    }
  };
}
