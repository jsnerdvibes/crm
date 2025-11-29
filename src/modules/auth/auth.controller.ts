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
   * /api/v1/auth/register:
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
   *                 status:
   *                   type: string
   *                   example: "success"
   *                 message:
   *                   type: string
   *                   example: "Tenant and Admin created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     tenantId:
   *                       type: string
   *                       example: "e23a966d-ae67-4b48-93f2-11f65457b274"
   *                     adminUserId:
   *                       type: string
   *                       example: "a602989a-8939-4237-bb7c-c91d3ea68795"
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       400:
   *         description: Bad request (e.g., duplicate tenant)
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
   *                   example: "Tenant with this name already exists"
   *                 data:
   *                   type: object
   *                   example: {}
   *                 errors:
   *                   type: array
   *                   items: {}
   *                   example: []
   *       422:
   *         description: Unprocessable Entity (validation errors)
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

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(req.body);
      return res
        .status(201)
        .json(successResponse('Tenant and Admin created successfully', result));
    } catch (error: any) {
      next(error);
    }
  };



/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user and get access token
 *     tags: [Auth]
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
 *                 example: "admin@acme.com"
 *               password:
 *                 type: string
 *                 example: "strongpassword123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user info
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
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "b8a136a9-6034-49b1-8a0d-3d9374d963ea"
 *                         email:
 *                           type: string
 *                           example: "admin@acme.com"
 *                         role:
 *                           type: string
 *                           example: "ADMIN"
 *                         tenantId:
 *                           type: string
 *                           example: "d34e4059-1270-4f73-9d40-ae81f48c3526"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       401:
 *         description: Invalid credentials (wrong email or password)
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
 *                   example: "Invalid credentials"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       422:
 *         description: Unprocessable Entity (validation errors)
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
  
 login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body);
      return res.json(successResponse("Login successful", result));
    } catch (err) {
      next(err);
    }
  };

}
