// modules/contacts/contacts.controller.ts
import {  Response, NextFunction } from 'express';
import { ContactsService } from './contacts.service';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../types/authRequest';

export class ContactsController {
  constructor(private service: ContactsService) {}

  // --------------------------------------
  // Create Contact
  // --------------------------------------

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     summary: Create a new contact within the tenant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1-202-555-0199"
 *               companyId:
 *                 type: string
 *                 example: "uuid-of-company"
 *     responses:
 *       201:
 *         description: Contact created successfully
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
 *                   example: "Contact created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-created-contact"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0199"
 *                     companyId:
 *                       type: string
 *                       example: "uuid-of-company"
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
 *         description: Validation errors (e.g., missing firstName or invalid email)
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
      const contact = await this.service.createContact(tenantId, req.body);
      return res
        .status(201)
        .json(successResponse('Contact created successfully', contact));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get All Contacts
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/contacts:
 *   get:
 *     summary: Retrieve all contacts for the tenant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
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
 *                   example: "Contacts retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "uuid-of-contact"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1-202-555-0199"
 *                       companyId:
 *                         type: string
 *                         example: "uuid-of-company"
 *                       tenantId:
 *                         type: string
 *                         example: "uuid-of-tenant"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-04T12:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-12-04T12:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (unauthorized tenant access)
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
      const contacts = await this.service.getAllContacts(tenantId);
      return res.json(successResponse('Contacts retrieved', contacts));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get Contact by ID
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/contacts/{id}:
 *   get:
 *     summary: Retrieve a single contact by ID within the tenant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the contact
 *         example: "uuid-of-contact"
 *     responses:
 *       200:
 *         description: Contact retrieved successfully
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
 *                   example: "Contact retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-contact"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.doe@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0199"
 *                     companyId:
 *                       type: string
 *                       example: "uuid-of-company"
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
 *       404:
 *         description: Contact not found
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
 *                   example: "Contact not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (contact does not belong to tenant)
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


  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const contactId = req.params.id;
      const contact = await this.service.getContactById(tenantId, contactId);
      return res.json(successResponse('Contact retrieved', contact));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Update Contact
  // --------------------------------------

  /**
 * @swagger
 * /api/v1/contacts/{id}:
 *   patch:
 *     summary: Update an existing contact within the tenant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the contact to update
 *         example: "uuid-of-contact"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.new@example.com"
 *               phone:
 *                 type: string
 *                 example: "+1-202-555-0199"
 *               companyId:
 *                 type: string
 *                 example: "uuid-of-company"
 *     responses:
 *       200:
 *         description: Contact updated successfully
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
 *                   example: "Contact updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "uuid-of-contact"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "john.new@example.com"
 *                     phone:
 *                       type: string
 *                       example: "+1-202-555-0199"
 *                     companyId:
 *                       type: string
 *                       example: "uuid-of-company"
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
 *                       example: "2025-12-05T14:00:00.000Z"
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Contact not found
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
 *                   example: "Contact not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (contact does not belong to the tenant)
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
 *         description: Validation error (invalid fields or email format)
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
 *                         example: "Email format is invalid"
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
      const contactId = req.params.id;
      const updated = await this.service.updateContact(tenantId, contactId, req.body);
      return res.json(successResponse('Contact updated successfully', updated));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Delete Contact
  // --------------------------------------

/**
 * @swagger
 * /api/v1/contacts/{id}:
 *   delete:
 *     summary: Delete a contact within the tenant
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the contact to delete
 *         example: "uuid-of-contact"
 *     responses:
 *       200:
 *         description: Contact deleted successfully
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
 *                   example: "Contact deleted successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       404:
 *         description: Contact not found
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
 *                   example: "Contact not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: array
 *                   items: {}
 *                   example: []
 *       403:
 *         description: Forbidden (contact does not belong to the tenant)
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
      const contactId = req.params.id;
      await this.service.deleteContact(tenantId, contactId);
      return res.json(successResponse('Contact deleted successfully'));
    } catch (error) {
      next(error);
    }
  };
}
