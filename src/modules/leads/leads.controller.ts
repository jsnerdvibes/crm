import { Response, NextFunction } from 'express';
import { LeadsService } from './leads.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';
import { LeadStatus } from '../../core/db';
import { BadRequestError } from '../../core/error';

export class LeadsController {
  constructor(private service: LeadsService) {}

  // --------------------------------------
  // Create a new lead
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/leads:
 *   post:
 *     summary: Create a new lead within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Website Lead"
 *               description:
 *                 type: string
 *                 example: "Lead interested in website development"
 *               source:
 *                 type: string
 *                 example: "LinkedIn"
 *               status:
 *                 type: string
 *                 enum: [NEW, IN_PROGRESS, QUALIFIED, LOST, WON]
 *                 example: "NEW"
 *               contactId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *     responses:
 *       201:
 *         description: Lead created successfully
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
 *                   example: "Lead created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-created-lead"
 *                     title:
 *                       type: string
 *                       example: "New Website Lead"
 *                     description:
 *                       type: string
 *                       example: "Lead interested in website development"
 *                     source:
 *                       type: string
 *                       example: "LinkedIn"
 *                     status:
 *                       type: string
 *                       example: "NEW"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     contactId:
 *                       type: string
 *                       nullable: true
 *                       example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                     assignedToId:
 *                       type: string
 *                       nullable: true
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Validation errors (e.g., missing title or invalid UUID)
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
 *                         example: "title"
 *                       message:
 *                         type: string
 *                         example: "Title is required"
 *       403:
 *         description: Forbidden (e.g., user not authorized)
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
      const result = await this.service.createLead(tenantId, req.body);

      return res
        .status(201)
        .json(successResponse('Lead created successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get lead by ID
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/leads/{id}:
 *   get:
 *     summary: Get a lead by ID within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
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
 *                   example: "Lead retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *                     title:
 *                       type: string
 *                       example: "New Website Lead"
 *                     description:
 *                       type: string
 *                       example: "Lead interested in website development"
 *                     source:
 *                       type: string
 *                       example: "LinkedIn"
 *                     status:
 *                       type: string
 *                       example: "NEW"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     contactId:
 *                       type: string
 *                       nullable: true
 *                       example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                     assignedToId:
 *                       type: string
 *                       nullable: true
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Lead not found
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
 *                   example: "Lead not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (tenant mismatch or unauthorized)
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

  findById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const leadId = req.params.id;

      const lead = await this.service.getLeadById(tenantId, leadId);

      return res.json(successResponse('Lead retrieved successfully', lead));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Update a lead
  // --------------------------------------

/**
 * @swagger
 * /api/v1/leads/{id}:
 *   patch:
 *     summary: Update a lead within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Website Lead"
 *               description:
 *                 type: string
 *                 example: "Lead is now highly interested after demo"
 *               source:
 *                 type: string
 *                 example: "Referral"
 *               status:
 *                 type: string
 *                 enum: [NEW, CONTACTED, QUALIFIED, LOST]
 *                 example: "CONTACTED"
 *               assignedToId:
 *                 type: string
 *                 nullable: true
 *                 example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *               contactId:
 *                 type: string
 *                 nullable: true
 *                 example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *     responses:
 *       200:
 *         description: Lead updated successfully
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
 *                   example: "Lead updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *                     title:
 *                       type: string
 *                       example: "Updated Website Lead"
 *                     description:
 *                       type: string
 *                       example: "Lead is now highly interested after demo"
 *                     source:
 *                       type: string
 *                       example: "Referral"
 *                     status:
 *                       type: string
 *                       example: "CONTACTED"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     contactId:
 *                       type: string
 *                       nullable: true
 *                       example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                     assignedToId:
 *                       type: string
 *                       nullable: true
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-05T13:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Validation error or invalid ID
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
 *                   example: "Invalid lead ID"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (tenant mismatch or unauthorized)
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

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const leadId = req.params.id;

      const updatedLead = await this.service.updateLead(tenantId, leadId, req.body);

      return res.json(successResponse('Lead updated successfully', updatedLead));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Delete a lead
  // --------------------------------------
  
/**
 * @swagger
 * /api/v1/leads/{id}:
 *   delete:
 *     summary: Delete a lead within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *     responses:
 *       200:
 *         description: Lead deleted successfully
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
 *                   example: "Lead deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Invalid lead ID or bad request
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
 *                   example: "Invalid lead ID"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (tenant mismatch or unauthorized)
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
 *         description: Lead not found
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
 *                   example: "Lead not found"
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
      const leadId = req.params.id;

      await this.service.deleteLead(tenantId, leadId);

      return res.json(successResponse('Lead deleted successfully', {}));
    } catch (error) {
      next(error);
    }
  };



// --------------------------------------
// Assign a lead to a user
// --------------------------------------

/**
 * @swagger
 * /api/v1/leads/{id}/assign:
 *   patch:
 *     summary: Assign a lead to a user within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *             required:
 *               - assignedToId
 *           example:
 *             assignedToId: "81a9fb22-543c-4df1-9f4e-1f8b2e900111"
 *     responses:
 *       200:
 *         description: Lead assigned successfully
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
 *                   example: "Lead assigned successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     assignedToId:
 *                       type: string
 *                   example:
 *                     id: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
 *                     assignedToId: "81a9fb22-543c-4df1-9f4e-1f8b2e900111"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Invalid lead ID or invalid assignedToId
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
 *                   example: "Invalid assignedToId"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (tenant mismatch or unauthorized)
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
 *         description: Lead not found
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
 *                   example: "Lead not found"
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

  assignLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;
    const leadId = req.params.id;
    const { assignedToId } = req.body;

    const result = await this.service.assignLead(tenantId, leadId, assignedToId);

    return res.json(successResponse("Lead assigned successfully", result));
  } catch (error) {
    next(error);
  }
};


// --------------------------------------
// Find leads with search, assignedToId, status, pagination
// --------------------------------------

/**
 * @swagger
 * /api/v1/leads/filter:
 *   get:
 *     summary: Filter and search leads within the tenant
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Search by title or description
 *         schema:
 *           type: string
 *           example: "website"
 *       - name: status
 *         in: query
 *         description: Filter by lead status
 *         schema:
 *           type: string
 *           example: "NEW"
 *       - name: assignedToId
 *         in: query
 *         description: Filter by assigned user ID
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "f21ab090-9dd3-420f-8cba-99acac110003"
 *       - name: source
 *         in: query
 *         description: Lead source
 *         schema:
 *           type: string
 *           example: "facebook"
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 20
 *     responses:
 *       200:
 *         description: Leads filtered successfully
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
 *                   example: "Leads filtered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     leads:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/LeadResponse'
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/BadRequest'
 *       403:
 *         description: Forbidden – unauthorized tenant access
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/ServerError'
 */

findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tenantId = req.user!.tenantId;

    const status = req.query.status as string;
    if (status && !Object.values(LeadStatus).includes(status as LeadStatus)) {
      throw new BadRequestError(`Invalid status value. Allowed values: ${Object.values(LeadStatus).join(', ')}`);
    }

    const filters = {
      search: req.query.search as string | undefined,
      status,
      assignedToId: req.query.assignedToId as string | undefined,
      source: req.query.source as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await this.service.filterLeads(tenantId, filters);

    return res.json(successResponse("Leads filtered successfully", result));
  } catch (error) {
    next(error);
  }
};





}
