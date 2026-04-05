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
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
// import { startJobs } from './jobs/jobRunner';
const rateLimiter_1 = require("./middlewares/rateLimiter");
exports.app = (0, express_1.default)();
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3001', 'https://test-saas-crm.lovable.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use(requestLogger_1.requestLogger);
(0, swagger_1.setupSwagger)(exports.app);
exports.app.use('/api/v1/', rateLimiter_1.apiLimiter);
exports.app.use('/api/v1', api_routes_1.apiRoutes);
// startJobs();
// --- Health Route ---
exports.app.get('/', (req, res) => {
    res.status(200).send('Server is up');
});
// --- Health Route ---
exports.app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});
exports.app.use(errorHandler_1.errorHandler);
