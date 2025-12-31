import { DashboardRepository } from "./dashboard.repo";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

const dashboardRepo = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepo);
export const dashboardController = new DashboardController(dashboardService);
