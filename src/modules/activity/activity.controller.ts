import { Response, NextFunction } from 'express';
import { ActivitiesService } from './activity.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';
import { ForbiddenError } from '../../core/error';

export class ActivitiesController {
  constructor(private service: ActivitiesService) {}

  // ----------------------------------------------------
  // Create Activity
  // ----------------------------------------------------

  /**
   * @swagger
   * /api/v1/activities:
   *   post:
   *     summary: Create a new activity within the tenant
   *     tags: [Activities]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               type:
   *                 type: string
   *                 description: Type of activity (e.g., CALL, EMAIL, TASK)
   *                 example: "CALL"
   *               targetType:
   *                 type: string
   *                 description: Polymorphic target type (Lead, Contact, Deal, Company)
   *                 enum: [Lead, Contact, Deal, Company]
   *                 example: "Lead"
   *               targetId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the target entity
   *                 example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *               body:
   *                 type: string
   *                 description: Optional body/notes for the activity
   *                 example: "Follow up call about website project"
   *               dueAt:
   *                 type: string
   *                 format: date-time
   *                 description: Optional due date for the activity
   *                 example: "2025-12-12T10:00:00.000Z"
   *               completed:
   *                 type: boolean
   *                 description: Whether the activity is completed
   *                 default: false
   *     responses:
   *       201:
   *         description: Activity created successfully
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
   *                   example: "Activity created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "uuid-of-created-activity"
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     actorId:
   *                       type: string
   *                       nullable: true
   *                       example: "uuid-of-actor"
   *                     type:
   *                       type: string
   *                       example: "CALL"
   *                     targetType:
   *                       type: string
   *                       example: "Lead"
   *                     targetId:
   *                       type: string
   *                       example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *                     body:
   *                       type: string
   *                       nullable: true
   *                       example: "Follow up call about website project"
   *                     dueAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: "2025-12-12T10:00:00.000Z"
   *                     completed:
   *                       type: boolean
   *                       example: false
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-10T12:00:00.000Z"
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Validation errors (e.g., missing type or targetId)
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
   *                         example: "targetId"
   *                       message:
   *                         type: string
   *                         example: "Target ID is required"
   *       403:
   *         description: Forbidden (user not authorized or tenant missing)
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
      const tenantId = req.user?.tenantId;
      const actorId = req.user?.id ?? null;

      const performedById = req.user?.id;

      if (!tenantId) throw new ForbiddenError('You are not authorized');

      const result = await this.service.createActivity(
        tenantId,
        actorId,
        req.body,
        performedById
      );

      return res
        .status(201)
        .json(successResponse('Activity created successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------
  // Get Activity by ID
  // ----------------------------------------------------

  /**
   * @swagger
   * /api/v1/activities/{id}:
   *   get:
   *     summary: Get a single activity by ID
   *     tags: [Activities]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID of the activity to retrieve
   *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *     responses:
   *       200:
   *         description: Activity retrieved successfully
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
   *                   example: "Activity retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     actorId:
   *                       type: string
   *                       nullable: true
   *                       example: "uuid-of-actor"
   *                     type:
   *                       type: string
   *                       example: "CALL"
   *                     targetType:
   *                       type: string
   *                       example: "Lead"
   *                     targetId:
   *                       type: string
   *                       example: "uuid-of-target"
   *                     body:
   *                       type: string
   *                       nullable: true
   *                       example: "Follow up call about website project"
   *                     dueAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: "2025-12-12T10:00:00.000Z"
   *                     completed:
   *                       type: boolean
   *                       example: false
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-10T12:00:00.000Z"
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       403:
   *         description: Forbidden (user not authorized or tenant missing)
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
   *         description: Activity not found
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
   *                   example: "Activity not found"
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
      const tenantId = req.user?.tenantId;
      const activityId = req.params.id;

      if (!tenantId) throw new ForbiddenError('You are not authorized');

      const activity = await this.service.getActivityById(tenantId, activityId);

      return res.json(
        successResponse('Activity retrieved successfully', activity)
      );
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------
  // Update Activity
  // ----------------------------------------------------

  /**
   * @swagger
   * /api/v1/activities/{id}:
   *   patch:
   *     summary: Update an existing activity by ID
   *     tags: [Activities]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID of the activity to update
   *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               type:
   *                 type: string
   *                 example: "CALL"
   *               targetType:
   *                 type: string
   *                 example: "Lead"
   *               targetId:
   *                 type: string
   *                 format: uuid
   *                 example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
   *               body:
   *                 type: string
   *                 nullable: true
   *                 example: "Follow up call rescheduled"
   *               dueAt:
   *                 type: string
   *                 format: date-time
   *                 nullable: true
   *                 example: "2025-12-12T10:00:00.000Z"
   *               completed:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: Activity updated successfully
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
   *                   example: "Activity updated successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     actorId:
   *                       type: string
   *                       nullable: true
   *                       example: "uuid-of-actor"
   *                     type:
   *                       type: string
   *                       example: "CALL"
   *                     targetType:
   *                       type: string
   *                       example: "Lead"
   *                     targetId:
   *                       type: string
   *                       example: "uuid-of-target"
   *                     body:
   *                       type: string
   *                       nullable: true
   *                       example: "Follow up call rescheduled"
   *                     dueAt:
   *                       type: string
   *                       format: date-time
   *                       nullable: true
   *                       example: "2025-12-12T10:00:00.000Z"
   *                     completed:
   *                       type: boolean
   *                       example: true
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-10T12:00:00.000Z"
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
   *                   example: "Forbidden"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       404:
   *         description: Activity not found
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
   *                   example: "Activity not found"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Validation errors (e.g., invalid type or targetId)
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
   *                         example: "type"
   *                       message:
   *                         type: string
   *                         example: "Type is required"
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
      const tenantId = req.user?.tenantId;
      const activityId = req.params.id;

      const performedById = req.user?.id;

      if (!tenantId) throw new ForbiddenError('You are not authorized');

      const updated = await this.service.updateActivity(
        tenantId,
        activityId,
        req.body,
        performedById
      );

      return res.json(
        successResponse('Activity updated successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------
  // Delete Activity
  // ----------------------------------------------------

  /**
   * @swagger
   * /api/v1/activities/{id}:
   *   delete:
   *     summary: Delete an activity by ID
   *     tags: [Activities]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: UUID of the activity to delete
   *         example: "6c2a7db0-fb73-4da3-8c73-f4e9da600001"
   *     responses:
   *       200:
   *         description: Activity deleted successfully
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
   *                   example: "Activity deleted successfully"
   *                 data:
   *                   type: object
   *                   example: {}
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
   *                   example: "Forbidden"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       404:
   *         description: Activity not found
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
   *                   example: "Activity not found"
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
      const tenantId = req.user?.tenantId;
      const activityId = req.params.id;
      const performedById = req.user?.id;

      if (!tenantId) throw new ForbiddenError('You are not authorized');

      await this.service.deleteActivity(tenantId, activityId, performedById);

      return res.json(successResponse('Activity deleted successfully', {}));
    } catch (error) {
      next(error);
    }
  };

  // ----------------------------------------------------
  // Get Activities Timeline (with polymorphic filters)
  // GET /activities?targetType=Lead&targetId=123
  // ----------------------------------------------------

  /**
   * @swagger
   * /api/v1/activities:
   *   get:
   *     summary: Get activities timeline with optional filters (polymorphic)
   *     tags: [Activities]
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
   *         description: Number of activities per page
   *       - in: query
   *         name: targetType
   *         schema:
   *           type: string
   *           example: "Lead"
   *         description: Filter activities by target type (e.g., Lead, Contact)
   *       - in: query
   *         name: targetId
   *         schema:
   *           type: string
   *           format: uuid
   *           example: "b3d1ce51-6e1e-4fa2-b39f-3a7d1f9a0001"
   *         description: Filter activities by specific target ID
   *       - in: query
   *         name: completed
   *         schema:
   *           type: boolean
   *           example: false
   *         description: Filter activities by completion status
   *     responses:
   *       200:
   *         description: Activities fetched successfully
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
   *                   example: "Activities fetched"
   *                 data:
   *                   type: object
   *                   properties:
   *                     activities:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                           tenantId:
   *                             type: string
   *                             format: uuid
   *                           actorId:
   *                             type: string
   *                             format: uuid
   *                             nullable: true
   *                           type:
   *                             type: string
   *                             example: "CALL"
   *                           targetType:
   *                             type: string
   *                             example: "Lead"
   *                           targetId:
   *                             type: string
   *                             format: uuid
   *                           body:
   *                             type: string
   *                             nullable: true
   *                           dueAt:
   *                             type: string
   *                             format: date-time
   *                             nullable: true
   *                           completed:
   *                             type: boolean
   *                             example: false
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 20
   *                     total:
   *                       type: integer
   *                       example: 50
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

  findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) throw new ForbiddenError('You are not authorized');

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      // Build flexible filters
      const filters: any = {
        page,
        limit,
        targetType: req.query.targetType || undefined,
        targetId: req.query.targetId || undefined,
        completed:
          req.query.completed === undefined
            ? undefined
            : req.query.completed === 'true',
      };

      // Remove undefined keys
      Object.keys(filters).forEach(
        (key) => filters[key] === undefined && delete filters[key]
      );

      const result = await this.service.getActivities(tenantId, filters);

      return res.json({
        status: 'success',
        message: 'Activities fetched',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
