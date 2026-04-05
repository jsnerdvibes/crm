"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealsController = exports.dealsService = exports.dealsRepository = void 0;
const deal_repo_1 = require("./deal.repo");
const deal_service_1 = require("./deal.service");
const deal_controller_1 = require("./deal.controller");
exports.dealsRepository = new deal_repo_1.DealsRepository();
exports.dealsService = new deal_service_1.DealsService(exports.dealsRepository);
exports.dealsController = new deal_controller_1.DealsController(exports.dealsService);
