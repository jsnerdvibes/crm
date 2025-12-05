"use strict";
// src/modules/users/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.usersService = exports.usersRepository = void 0;
const users_repo_1 = require("./users.repo");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
exports.usersRepository = new users_repo_1.UsersRepository();
exports.usersService = new users_service_1.UsersService(exports.usersRepository);
exports.userController = new users_controller_1.UsersController(exports.usersService);
