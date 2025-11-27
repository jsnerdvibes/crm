// src/modules/auth/index.ts

import { AuthRepository } from "./auth.repo";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

export const authRepository = new AuthRepository();
export const authService = new AuthService(authRepository);
export const authController = new AuthController(authService);
