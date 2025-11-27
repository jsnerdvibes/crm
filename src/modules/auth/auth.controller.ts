import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';
import { errorResponse, successResponse } from '../../utils/response';

export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * @swagger
   * tags:
   *   name: Auth
   *   description: Authentication endpoints
   */

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new tenant and admin user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - tenantName
   *               - email
   *               - password
   *             properties:
   *               tenantName:
   *                 type: string
   *                 example: "Acme Corp"
   *               email:
   *                 type: string
   *                 example: "admin@acme.com"
   *               password:
   *                 type: string
   *                 example: "strongpassword123"
   *     responses:
   *       201:
   *         description: Tenant and Admin created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 tenantId:
   *                   type: string
   *                 adminUserId:
   *                   type: string
   *       400:
   *         description: Bad request / validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(req.body);
      return res
        .status(201)
        .json(successResponse('Tenant and Admin created successfully', result));
    } catch (error: any) {
      // Basic error handling

      next(error);
    }
  };
}
