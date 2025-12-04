import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { prisma } from "../core/db";
import { UnauthorizedError } from "../core/error";
import { AuthRequest } from "../types/authRequest";


export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
       throw new UnauthorizedError("Missing token")
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, config.jwt.secret) as {
      sub: string;
      tenantId: string;
      role: string;
    };

    // FIX HERE — use decoded.sub
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid User")
    }

    req.user = {
      id: decoded.sub,
      tenantId: decoded.tenantId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid User")
  }
};