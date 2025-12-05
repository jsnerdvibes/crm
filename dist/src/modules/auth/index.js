"use strict";
// src/modules/auth/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.authService = exports.authRepository = void 0;
const auth_repo_1 = require("./auth.repo");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
exports.authRepository = new auth_repo_1.AuthRepository();
exports.authService = new auth_service_1.AuthService(exports.authRepository);
exports.authController = new auth_controller_1.AuthController(exports.authService);
