import { Response, NextFunction } from 'express';
import { UsersService } from './users.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';
import { auditService } from '../audit';

export class UsersController {
  constructor(private service: UsersService) {}

  /**
   * @swagger
   * /api/v1/users:
   *   post:
   *     summary: Create a new user within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "john.doe@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "password123"
   *               name:
   *                 type: string
   *                 example: "John Doe"
   *               role:
   *                 type: string
   *                 enum: [SUPER_ADMIN, ADMIN, MANAGER, SALES, SUPPORT]
   *                 default: SALES
   *                 example: SALES
   *     responses:
   *       201:
   *         description: User created successfully
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
   *                   example: "User created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "uuid-of-created-user"
   *                     email:
   *                       type: string
   *                       example: "john.doe@example.com"
   *                     name:
   *                       type: string
   *                       example: "John Doe"
   *                     role:
   *                       type: string
   *                       example: "SALES"
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-04T12:00:00.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-04T12:00:00.000Z"
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Validation errors (e.g., invalid email, password too short)
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
   *                         example: "email"
   *                       message:
   *                         type: string
   *                         example: "Valid email is required"
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

  // --------------------------------------
  // Create user
  // --------------------------------------
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const result = await this.service.createUser(tenantId, req.body);

    const userId = req.user?.id;
    const title = result.name;
    const resourceId = result.id;

    await auditService.logAction({
      tenantId,
      userId,
      action: "CREATE",
      resource: "user",
      resourceId,
      meta: { title },
    });


      return res
        .status(201)
        .json(successResponse('User created successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get user by ID
  // --------------------------------------

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   get:
   *     summary: Get a single user by ID within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: UUID of the user to retrieve
   *         schema:
   *           type: string
   *           example: "uuid-of-user"
   *     responses:
   *       200:
   *         description: User retrieved successfully
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
   *                   example: "User retrieved successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "uuid-of-user"
   *                     email:
   *                       type: string
   *                       example: "john.doe@example.com"
   *                     name:
   *                       type: string
   *                       example: "John Doe"
   *                     role:
   *                       type: string
   *                       example: "SALES"
   *                     isActive:
   *                       type: boolean
   *                       example: true
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-04T12:00:00.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-05T12:00:00.000Z"
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
   *         description: User not found
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
   *                   example: "User not found"
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
      const userId = req.params.id;

      const user = await this.service.getUserById(tenantId, userId);

      return res.json(successResponse('User retrieved successfully', user));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get all users
  // --------------------------------------

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Get all users within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Users fetched successfully
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
   *                   example: "Users fetched successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     users:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             example: "uuid-of-user"
   *                           email:
   *                             type: string
   *                             example: "john.doe@example.com"
   *                           name:
   *                             type: string
   *                             example: "John Doe"
   *                           role:
   *                             type: string
   *                             example: "SALES"
   *                           tenantId:
   *                             type: string
   *                             example: "uuid-of-tenant"
   *                           isActive:
   *                             type: boolean
   *                             example: true
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *                             example: "2025-12-04T12:00:00.000Z"
   *                           updatedAt:
   *                             type: string
   *                             format: date-time
   *                             example: "2025-12-04T12:00:00.000Z"
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
      const tenantId = req.user!.tenantId;

      const users = await this.service.getAllUsers(tenantId);

      return res.json(successResponse('Users fetched successfully', { users }));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Update user
  // --------------------------------------

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   patch:
   *     summary: Update a user within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: UUID of the user to update
   *         schema:
   *           type: string
   *           example: "uuid-of-user"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 example: "john.doe@example.com"
   *               password:
   *                 type: string
   *                 minLength: 6
   *                 example: "newpassword123"
   *               name:
   *                 type: string
   *                 example: "John Doe Updated"
   *               role:
   *                 type: string
   *                 enum: [SUPER_ADMIN, ADMIN, MANAGER, SALES, SUPPORT]
   *                 example: "MANAGER"
   *               isActive:
   *                 type: boolean
   *                 example: true
   *     responses:
   *       200:
   *         description: User updated successfully
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
   *                   example: "User updated successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "uuid-of-user"
   *                     email:
   *                       type: string
   *                       example: "john.doe@example.com"
   *                     name:
   *                       type: string
   *                       example: "John Doe Updated"
   *                     role:
   *                       type: string
   *                       example: "MANAGER"
   *                     isActive:
   *                       type: boolean
   *                       example: true
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-04T12:00:00.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-05T12:00:00.000Z"
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
   *         description: User not found
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
   *                   example: "User not found"
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
      const userId = req.params.id;

      const updated = await this.service.updateUser(tenantId, userId, req.body);

      return res.json(successResponse('User updated successfully', updated));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Deactivate user
  // --------------------------------------

  /**
   * @swagger
   * /api/v1/users/{id}/deactivate:
   *   patch:
   *     summary: Deactivate a user within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: UUID of the user to deactivate
   *         schema:
   *           type: string
   *           example: "uuid-of-user"
   *     responses:
   *       200:
   *         description: User deactivated successfully
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
   *                   example: "User deactivated successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       example: "uuid-of-user"
   *                     email:
   *                       type: string
   *                       example: "john.doe@example.com"
   *                     name:
   *                       type: string
   *                       example: "John Doe"
   *                     role:
   *                       type: string
   *                       example: "SALES"
   *                     isActive:
   *                       type: boolean
   *                       example: false
   *                     tenantId:
   *                       type: string
   *                       example: "uuid-of-tenant"
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-04T12:00:00.000Z"
   *                     updatedAt:
   *                       type: string
   *                       format: date-time
   *                       example: "2025-12-05T12:00:00.000Z"
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
   *         description: User not found
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
   *                   example: "User not found"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Validation error (e.g., trying to deactivate an Admin)
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
   *                   example: "Admin users cannot be deactivated"
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

  deactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.params.id;

      const updated = await this.service.deactivateUser(tenantId, userId);

      return res.json(
        successResponse('User deactivated successfully', updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Hard Delete user
  // --------------------------------------

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Permanently delete a user within the tenant
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: UUID of the user to delete
   *         schema:
   *           type: string
   *           example: "uuid-of-user"
   *     responses:
   *       200:
   *         description: User deleted permanently
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
   *                   example: "User deleted permanently"
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
   *         description: User not found
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
   *                   example: "User not found"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Validation error (e.g., attempting to delete an Admin)
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
   *                   example: "Admin users cannot be deleted"
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
      const userId = req.params.id;

      await this.service.delete(tenantId, userId);

      return res.json(successResponse('User deleted permanently', {}));
    } catch (error) {
      next(error);
    }
  };
}
