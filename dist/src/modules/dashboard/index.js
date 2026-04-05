"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboard_repo_1 = require("./dashboard.repo");
const dashboard_service_1 = require("./dashboard.service");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboardRepo = new dashboard_repo_1.DashboardRepository();
const dashboardService = new dashboard_service_1.DashboardService(dashboardRepo);
exports.dashboardController = new dashboard_controller_1.DashboardController(dashboardService);
