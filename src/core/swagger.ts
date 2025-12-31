import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { config } from '../config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API',
      version: '1.0.0',
      description: 'API Documentation for CRM',
    },

    servers: [
      {
        url: `http://localhost:${config.app.port}`,
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
        Forbidden: {
          description: 'Forbidden – user not authorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Unauthorized',
                  },
                  data: {
                    type: 'object',
                    example: {},
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
                  message: {
                    type: 'string',
                    example: 'Something went wrong',
                  },
                  data: {
                    type: 'object',
                    example: {},
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

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
