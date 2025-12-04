// src/modules/users/index.ts

import { UsersRepository } from "./users.repo";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

export const usersRepository = new UsersRepository();
export const usersService = new UsersService(usersRepository);
export const userController = new UsersController(usersService);
