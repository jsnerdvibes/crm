import { NextFunction, Response } from "express";
import { AuthRequest } from "../../types/authRequest";
import { DashboardService } from "./dashboard.service";
import { ForbiddenError } from "../../core/error";

export class DashboardController {
  constructor(private readonly service: DashboardService) {}


// --------------------------------------
// PIPELINE SUMMARY (Deals by stage)
// --------------------------------------

/**
 * @swagger
 * /api/v1/dashboard/pipeline:
 *   get:
 *     summary: Get deal pipeline summary by stage
 *     description: |
 *       Returns a summary of deals grouped by pipeline stages  
 *       (QUALIFICATION, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST)
 *       for the authenticated tenant.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pipeline summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pipeline summary fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     QUALIFICATION:
 *                       type: integer
 *                       example: 3
 *                     PROPOSAL:
 *                       type: integer
 *                       example: 2
 *                     NEGOTIATION:
 *                       type: integer
 *                       example: 1
 *                     CLOSED_WON:
 *                       type: integer
 *                       example: 4
 *                     CLOSED_LOST:
 *                       type: integer
 *                       example: 1
 *       403:
 *         description: Forbidden – user not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Forbidden"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/ServerError"
 */
  getPipeline = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new ForbiddenError("Unauthorized");

      const data = await this.service.getPipelineSummary(tenantId);

      res.json({
        message: "Pipeline summary fetched",
        data,
      });
    } catch (err) {
      next(err);
    }
  };


// --------------------------------------
// DASHBOARD TOTAL COUNTS
// --------------------------------------

/**
 * @swagger
 * /api/v1/dashboard/totals:
 *   get:
 *     summary: Get total counts for dashboard entities
 *     description: |
 *       Returns total counts of key CRM entities  
 *       including leads, deals, contacts, and companies
 *       for the authenticated tenant.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard totals fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Dashboard totals fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     leads:
 *                       type: integer
 *                       example: 12
 *                     deals:
 *                       type: integer
 *                       example: 6
 *                     contacts:
 *                       type: integer
 *                       example: 9
 *                     companies:
 *                       type: integer
 *                       example: 3
 *       403:
 *         description: Forbidden – user not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Forbidden"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/ServerError"
 */
  getTotals = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new ForbiddenError("Unauthorized");

      const data = await this.service.getTotals(tenantId);

      res.json({
        message: "Dashboard totals fetched",
        data,
      });
    } catch (err) {
      next(err);
    }
  };


// --------------------------------------
// ACTIVITY STATISTICS
// --------------------------------------

/**
 * @swagger
 * /api/v1/dashboard/activities:
 *   get:
 *     summary: Get activity statistics
 *     description: |
 *       Returns statistics of activities grouped by type  
 *       (NOTE, CALL, MEETING, TASK) for the authenticated tenant.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activity statistics fetched
 *                 data:
 *                   type: object
 *                   properties:
 *                     NOTE:
 *                       type: integer
 *                       example: 5
 *                     CALL:
 *                       type: integer
 *                       example: 2
 *                     MEETING:
 *                       type: integer
 *                       example: 1
 *                     TASK:
 *                       type: integer
 *                       example: 4
 *       403:
 *         description: Forbidden – user not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/Forbidden"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/responses/ServerError"
 */
  getActivities = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new ForbiddenError("Unauthorized");

      const data = await this.service.getActivityStats(tenantId);

      res.json({
        message: "Activity statistics fetched",
        data,
      });
    } catch (err) {
      next(err);
    }
  };
}
