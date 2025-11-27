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
  },
  apis: ['./src/modules/**/*.ts'], // <-- scan all modules for JSDoc comments
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
