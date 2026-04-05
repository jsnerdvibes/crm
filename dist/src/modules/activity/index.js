"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activitiesController = exports.activitiesService = exports.activitiesRepository = void 0;
const activity_repo_1 = require("./activity.repo");
const activity_service_1 = require("./activity.service");
const activity_controller_1 = require("./activity.controller");
exports.activitiesRepository = new activity_repo_1.ActivitiesRepository();
exports.activitiesService = new activity_service_1.ActivitiesService(exports.activitiesRepository);
exports.activitiesController = new activity_controller_1.ActivitiesController(exports.activitiesService);
