"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const requestLogger_1 = require("./middlewares/requestLogger");
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = require("./core/swagger");
const api_routes_1 = require("./routes/api.routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(requestLogger_1.requestLogger);
(0, swagger_1.setupSwagger)(exports.app);
exports.app.use('/api/v1', api_routes_1.apiRoutes);
// --- Health Route ---
exports.app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
exports.app.use(errorHandler_1.errorHandler);
