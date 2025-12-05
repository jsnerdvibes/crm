"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("../config");
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRM API',
            version: '1.0.0',
            description: 'API Documentation for CRM',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT', // optional, for clarity
                },
            },
        },
        security: [
            {
                bearerAuth: [], // apply globally
            },
        ],
        servers: [
            {
                url: `http://localhost:${config_1.config.app.port}`,
            },
        ],
    },
    apis: ['./src/modules/**/*.ts'], // <-- scan all modules for JSDoc comments
};
const specs = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
};
exports.setupSwagger = setupSwagger;
