"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.options = void 0;
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
        servers: [
            {
                url: `http://localhost:${config_1.config.app.port}`,
            },
        ],
        security: [
            {
                bearerAuth: [],
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Unauthorized – invalid or missing token',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Unauthorized',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {},
                                    },
                                },
                            },
                        },
                    },
                },
                Forbidden: {
                    description: 'Forbidden – user not authorized',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Forbidden',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {},
                                    },
                                },
                            },
                        },
                    },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Resource not found',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {},
                                    },
                                },
                            },
                        },
                    },
                },
                BadRequest: {
                    description: 'Bad request',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Bad request',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {},
                                    },
                                },
                            },
                        },
                    },
                },
                ServerError: {
                    description: 'Internal server error',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        example: 'error',
                                    },
                                    message: {
                                        type: 'string',
                                        example: 'Something went wrong',
                                    },
                                    data: {
                                        type: 'object',
                                        example: {},
                                    },
                                    errors: {
                                        type: 'array',
                                        items: {},
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/modules/**/*.ts'],
};
exports.options = options;
const swagger_spec_json_1 = __importDefault(require("./swagger-spec.json"));
const setupSwagger = (app) => {
    const swaggerOptions = {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
            'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
        ],
    };
    app.use('/api/v1/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_spec_json_1.default, swaggerOptions));
};
exports.setupSwagger = setupSwagger;
