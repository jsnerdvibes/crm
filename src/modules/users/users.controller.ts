import { Response, NextFunction } from "express";
import { UsersService } from "./users.service";
import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/authRequest";

export class UsersController {
  constructor(private service: UsersService) {}

  // --------------------------------------
  // Create user
  // --------------------------------------
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const result = await this.service.createUser(tenantId, req.body);

      return res
        .status(201)
        .json(successResponse("User created successfully", result));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get user by ID
  // --------------------------------------
  findById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.params.id;

      const user = await this.service.getUserById(tenantId, userId);

      return res.json(successResponse("User retrieved successfully", user));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Get all users
  // --------------------------------------
  findAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;

      const users = await this.service.getAllUsers(tenantId);

      return res.json(successResponse("Users fetched successfully", { users }));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Update user
  // --------------------------------------
  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.params.id;

      const updated = await this.service.updateUser(tenantId, userId, req.body);

      return res.json(successResponse("User updated successfully", updated));
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Deactivate user
  // --------------------------------------
  deactivate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.params.id;

      const updated = await this.service.deactivateUser(tenantId, userId);

      return res.json(
        successResponse("User deactivated successfully", updated)
      );
    } catch (error) {
      next(error);
    }
  };

  // --------------------------------------
  // Hard Delete user
  // --------------------------------------
  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const tenantId = req.user!.tenantId;
      const userId = req.params.id;

      await this.service.delete(tenantId, userId);

      return res.json(successResponse("User deleted permanently", {}));
    } catch (error) {
      next(error);
    }
  };
}
