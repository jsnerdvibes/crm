import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private service: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.service.register(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      // Basic error handling
      return res.status(400).json({ error: error.message });
    }
  };
}
