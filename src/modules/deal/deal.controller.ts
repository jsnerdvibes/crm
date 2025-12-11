import { Response, NextFunction } from 'express';
import { DealsService } from './deal.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';
import { ForbiddenError } from '../../core/error';

export class DealsController {
  constructor(private service: DealsService) {}

  // -------------------------------------
  // CREATE DEAL
  // -------------------------------------

/**
 * @swagger
 * /api/v1/deals:
 *   post:
 *     summary: Create a new deal within the tenant
 *     tags: [Deals]
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
 *                 example: "Website Development Deal"
 *               amount:
 *                 type: number
 *                 example: 50000
 *               stage:
 *                 type: string
 *                 enum: [PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
 *                 example: "PROSPECTING"
 *               description:
 *                 type: string
 *                 example: "Potential deal for full website development"
 *               companyId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
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
 *         description: Deal created successfully
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
 *                   example: "Deal created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                     title:
 *                       type: string
 *                       example: "Website Development Deal"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     stage:
 *                       type: string
 *                       example: "PROSPECTING"
 *                     description:
 *                       type: string
 *                       example: "Potential deal for full website development"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     companyId:
 *                       type: string
 *                       nullable: true
 *                       example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
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
 *                       example: "2025-12-09T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-09T12:00:00.000Z"
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

      const performedById = req.user?.id

      const result = await this.service.createDeal(tenantId, req.body, performedById);

      return res
        .status(201)
        .json(successResponse('Deal created successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // GET DEAL BY ID
  // -------------------------------------

/**
 * @swagger
 * /api/v1/deals/{id}:
 *   get:
 *     summary: Get a single deal by ID within the tenant
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Deal ID
 *         example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *     responses:
 *       200:
 *         description: Deal retrieved successfully
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
 *                   example: "Deal retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                     title:
 *                       type: string
 *                       example: "Website Development Deal"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     stage:
 *                       type: string
 *                       example: "PROSPECTING"
 *                     description:
 *                       type: string
 *                       example: "Potential deal for full website development"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     companyId:
 *                       type: string
 *                       nullable: true
 *                       example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
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
 *                       example: "2025-12-09T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-09T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Deal not found
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
 *                   example: "Deal not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., user not authorized for this tenant)
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
      const dealId = req.params.id;

      const deal = await this.service.getDealById(tenantId, dealId);

      return res.json(successResponse('Deal retrieved successfully', deal));
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // UPDATE DEAL
  // -------------------------------------

  /**
 * @swagger
 * /api/v1/deals/{id}:
 *   patch:
 *     summary: Update an existing deal within the tenant
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Deal ID
 *         example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Deal Title"
 *               amount:
 *                 type: number
 *                 example: 75000
 *               probability:
 *                 type: number
 *                 example: 70
 *               stage:
 *                 type: string
 *                 enum: [PROSPECTING, QUALIFIED, PROPOSAL_SENT, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
 *                 example: "NEGOTIATION"
 *               companyId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
 *               assignedToId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *     responses:
 *       200:
 *         description: Deal updated successfully
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
 *                   example: "Deal updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                     title:
 *                       type: string
 *                       example: "Updated Deal Title"
 *                     amount:
 *                       type: number
 *                       example: 75000
 *                     probability:
 *                       type: number
 *                       example: 70
 *                     stage:
 *                       type: string
 *                       example: "NEGOTIATION"
 *                     companyId:
 *                       type: string
 *                       nullable: true
 *                       example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
 *                     assignedToId:
 *                       type: string
 *                       nullable: true
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-09T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-10T15:30:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Deal not found
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
 *                   example: "Deal not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Validation error (e.g., invalid stage or UUID)
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
 *                   example: []
 *       403:
 *         description: Forbidden (unauthorized tenant or permissions)
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
      const dealId = req.params.id;

      const performedById = req.user?.id


      const updated = await this.service.updateDeal(tenantId, dealId, req.body, performedById);

      return res.json(successResponse('Deal updated successfully', updated));
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // DELETE DEAL
  // -------------------------------------

  /**
 * @swagger
 * /api/v1/deals/{id}:
 *   delete:
 *     summary: Delete a deal by ID within the tenant
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Deal ID to delete
 *         example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *     responses:
 *       200:
 *         description: Deal deleted successfully
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
 *                   example: "Deal deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Deal not found
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
 *                   example: "Deal not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., deal does not belong to tenant)
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

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const dealId = req.params.id;

      const performedById = req.user?.id

      await this.service.deleteDeal(tenantId, dealId, performedById);

      return res.json(successResponse('Deal deleted successfully', {}));
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // ASSIGN DEAL
  // -------------------------------------

/**
 * @swagger
 * /api/v1/deals/{id}/assign:
 *   patch:
 *     summary: Assign a deal to a user within the tenant
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Deal ID to assign
 *         example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
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
 *                 description: ID of the user to assign the deal to
 *                 example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *     responses:
 *       200:
 *         description: Deal assigned successfully
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
 *                   example: "Deal assigned successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                     title:
 *                       type: string
 *                       example: "Website Development Deal"
 *                     assignedToId:
 *                       type: string
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     stage:
 *                       type: string
 *                       example: "PROSPECTING"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     companyId:
 *                       type: string
 *                       nullable: true
 *                       example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
 *                     contactId:
 *                       type: string
 *                       nullable: true
 *                       example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-09T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-10T15:30:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Deal not found
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
 *                   example: "Deal not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., user not authorized to assign this deal)
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
 *       422:
 *         description: Validation error (e.g., invalid assignedToId)
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

  assignDeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const dealId = req.params.id;
      const { assignedToId } = req.body;

      const performedById = req.user?.id

      const updated = await this.service.assignDeal(
        tenantId,
        dealId,
        assignedToId,
        performedById
      );

      return res.json(
        successResponse('Deal assigned successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // UPDATE DEAL STAGE
  // -------------------------------------

/**
 * @swagger
 * /api/v1/deals/{id}/stage:
 *   patch:
 *     summary: Update the stage of a deal within the tenant
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Deal ID to update
 *         example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage:
 *                 type: string
 *                 description: New stage for the deal
 *                 enum: [PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
 *                 example: "NEGOTIATION"
 *     responses:
 *       200:
 *         description: Deal stage updated successfully
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
 *                   example: "Deal stage updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                     title:
 *                       type: string
 *                       example: "Website Development Deal"
 *                     stage:
 *                       type: string
 *                       example: "NEGOTIATION"
 *                     assignedToId:
 *                       type: string
 *                       nullable: true
 *                       example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                     amount:
 *                       type: number
 *                       example: 50000
 *                     companyId:
 *                       type: string
 *                       nullable: true
 *                       example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
 *                     contactId:
 *                       type: string
 *                       nullable: true
 *                       example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                     tenantId:
 *                       type: string
 *                       example: "uuid-of-tenant"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-09T12:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-10T15:30:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Deal not found
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
 *                   example: "Deal not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (e.g., deal does not belong to tenant)
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
 *       422:
 *         description: Validation error (e.g., invalid stage)
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

  updateStage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const dealId = req.params.id;
      const { stage } = req.body;
      const performedById = req.user?.id

      const updated = await this.service.updateDealStage(
        tenantId,
        dealId,
        stage,
        performedById
      );

      return res.json(
        successResponse('Deal stage updated successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------
  // LIST DEALS WITH FILTERS + PAGINATION
  // -------------------------------------

  /**
 * @swagger
 * /api/v1/deals:
 *   get:
 *     summary: List deals within the tenant with optional filters and pagination
 *     tags: [Deals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of deals per page
 *       - in: query
 *         name: stage
 *         schema:
 *           type: string
 *           enum: [PROSPECTING, QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST]
 *         description: Filter deals by stage
 *       - in: query
 *         name: assignedToId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter deals assigned to a specific user
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter deals related to a specific company
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search deals by title or description
 *     responses:
 *       200:
 *         description: Deals fetched successfully
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
 *                   example: "Deals fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "c1f92c71-c30f-46a3-8e21-92bb12af0001"
 *                           title:
 *                             type: string
 *                             example: "Website Development Deal"
 *                           stage:
 *                             type: string
 *                             example: "PROSPECTING"
 *                           assignedToId:
 *                             type: string
 *                             nullable: true
 *                             example: "7a19fcd5-33b6-49fb-8aab-a2e775600002"
 *                           amount:
 *                             type: number
 *                             example: 50000
 *                           companyId:
 *                             type: string
 *                             nullable: true
 *                             example: "5c1d2f11-91e1-4e3a-8f1d-a09d4f100001"
 *                           contactId:
 *                             type: string
 *                             nullable: true
 *                             example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
 *                           tenantId:
 *                             type: string
 *                             example: "uuid-of-tenant"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-12-09T12:00:00.000Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-12-10T15:30:00.000Z"
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (user not authorized)
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
 *                   example: "You are not authorized"
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

  findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        throw new ForbiddenError('You are not authorized');
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const filters: any = {
        page,
        limit,
        stage: req.query.stage || undefined,
        assignedToId: req.query.assignedToId || undefined,
        companyId: req.query.companyId || undefined,
        search: req.query.search || undefined,
      };

      // Clean undefined filters
      Object.keys(filters).forEach(
        key => filters[key] === undefined && delete filters[key]
      );

      const result = await this.service.getDeals(tenantId, filters);

      return res.json({
        status: 'success',
        message: 'Deals fetched',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}