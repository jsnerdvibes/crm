"use strict";
// src/modules/auth/auth.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const validate_1 = require("../../middlewares/validate");
const dto_1 = require("./dto");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(dto_1.RegisterSchema), index_1.authController.register);
router.post('/login', (0, validate_1.validate)(dto_1.LoginSchema), index_1.authController.login);
router.post('/refresh', (0, validate_1.validate)(dto_1.RefreshTokenSchema), index_1.authController.refresh);
router.post('/logout', (0, validate_1.validate)(dto_1.RefreshTokenSchema), index_1.authController.logout);
exports.default = router;
