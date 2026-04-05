"use strict";
// src/modules/setting/setting.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("./index");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', index_1.settingController.getAll);
router.get('/:key', index_1.settingController.getByKey);
router.patch('/:key', index_1.settingController.update);
exports.default = router;
