import { Response, NextFunction } from "express";
import { AuditService } from "./audit.service";
import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/authRequest";
import { AuditLogQuerySchema } from "./dto";

export class AuditController {
  constructor(private service: AuditService) {}

  // -------------------------------------------------------
  // Get paginated audit logs with filters
  // -------------------------------------------------------

  /**
   * @swagger
   * /api/v1/audit-logs:
   *   get:
   *     summary: Get all audit logs for the tenant
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: resource
   *         schema:
   *           type: string
   *         example: "lead"
   *       - in: query
   *         name: action
   *         schema:
   *           type: string
   *         example: "LEAD_CREATED"
   *       - in: query
   *         name: resourceId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: from
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: to
   *         schema:
   *           type: string
   *           format: date
   *       - in: query
   *         name: page
   *         schema:
   *           type: number
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: number
   *         example: 20
   *     responses:
   *       200:
   *         description: Audit logs fetched successfully
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal Server Error
   */
  find = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;

      const query = AuditLogQuerySchema.parse(req.query);

      const logs = await this.service.getLogs(tenantId, query);

      return res.json(
        successResponse("Audit logs fetched successfully", logs)
      );
    } catch (error) {
      next(error);
    }
  };

  // -------------------------------------------------------
  // Get single audit log by ID
  // -------------------------------------------------------

  /**
   * @swagger
   * /api/v1/audit-logs/{id}:
   *   get:
   *     summary: Get a single audit log by ID
   *     tags: [Audit]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Audit log fetched successfully
   *       404:
   *         description: Audit log not found
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Internal Server Error
   */
  findById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const logId = req.params.id;

      const log = await this.service.getLogById(tenantId, logId);

      return res.json(
        successResponse("Audit log retrieved successfully", log)
      );
    } catch (error) {
      next(error);
    }
  };
}
