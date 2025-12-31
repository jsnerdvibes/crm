// src/modules/setting/setting.controller.ts

import { Response } from 'express';
import { SettingService } from './setting.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';
import { ForbiddenError } from '../../core/error';

export class SettingController {
  constructor(private readonly service: SettingService) {}

  private getTenantId(req: AuthRequest): string {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      throw new ForbiddenError('Tenant cannot be undefined');
    }
    return tenantId;
  }

  /**
   * @swagger
   * /api/v1/settings:
   *   get:
   *     summary: Get all tenant settings
   *     description: |
   *       Fetches all settings configured for the authenticated tenant.
   *       Tenant is automatically resolved from the JWT token.
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *
   *     responses:
   *       200:
   *         description: Settings fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Settings fetched
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         format: uuid
   *                         example: 3a1e4a62-9d2c-4d52-bb77-ecf25b6a9d90
   *                       tenantId:
   *                         type: string
   *                         format: uuid
   *                         example: 9b2b3f70-30fa-4a3d-b0c6-d4cb7c7ad998
   *                       key:
   *                         type: string
   *                         example: timezone
   *                       value:
   *                         type: string
   *                         example: Asia/Kolkata
   *                       createdAt:
   *                         type: string
   *                         format: date-time
   *                       updatedAt:
   *                         type: string
   *                         format: date-time
   *
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/Unauthorized"
   *
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/ServerError"
   */

  getAll = async (req: AuthRequest, res: Response) => {
    const tenantId = this.getTenantId(req);
    const settings = await this.service.getAll(tenantId);
    return res.json(successResponse('Settings fetched', settings));
  };

  /**
   * @swagger
   * /api/v1/settings/{key}:
   *   get:
   *     summary: Get a setting by key
   *     description: |
   *       Fetches a single setting value for the authenticated tenant
   *       using the provided setting key.
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *
   *     parameters:
   *       - name: key
   *         in: path
   *         required: true
   *         description: Setting key
   *         schema:
   *           type: string
   *           example: timezone
   *
   *     responses:
   *       200:
   *         description: Setting fetched successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Setting fetched
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     tenantId:
   *                       type: string
   *                       format: uuid
   *                     key:
   *                       type: string
   *                       example: timezone
   *                     value:
   *                       type: string
   *                       example: Asia/Kolkata
   *
   *       404:
   *         description: Setting not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/NotFound"
   *
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/Unauthorized"
   *
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/ServerError"
   */

  getByKey = async (req: AuthRequest, res: Response) => {
    const tenantId = this.getTenantId(req);
    const { key } = req.params;

    const setting = await this.service.getByKey(tenantId, key);
    return res.json(successResponse('Setting fetched', setting));
  };

  /**
   * @swagger
   * /api/v1/settings/{key}:
   *   patch:
   *     summary: Update a setting value
   *     description: |
   *       Updates the value of an existing setting for the authenticated tenant.
   *       Settings are pre-created during tenant onboarding and cannot be created manually.
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *
   *     parameters:
   *       - name: key
   *         in: path
   *         required: true
   *         description: Setting key to update
   *         schema:
   *           type: string
   *           example: timezone
   *
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - value
   *             properties:
   *               value:
   *                 type: string
   *                 example: Asia/Kolkata
   *
   *     responses:
   *       200:
   *         description: Setting updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: string
   *                   example: success
   *                 message:
   *                   type: string
   *                   example: Setting updated
   *                 data:
   *                   type: object
   *                   properties:
   *                     key:
   *                       type: string
   *                       example: timezone
   *                     value:
   *                       type: string
   *                       example: Asia/Kolkata
   *
   *       404:
   *         description: Setting not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/NotFound"
   *
   *       400:
   *         description: Invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/BadRequest"
   *
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/Unauthorized"
   *
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/responses/ServerError"
   */
  update = async (req: AuthRequest, res: Response) => {
    const tenantId = this.getTenantId(req);
    const { key } = req.params;
    const { value } = req.body;

    const setting = await this.service.update(tenantId, key, value);
    return res.json(successResponse('Setting updated', setting));
  };
}
