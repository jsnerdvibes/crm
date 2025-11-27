import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SaaS CRM API',
      version: '1.0.0',
      description: 'API Documentation for the SaaS CRM',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'], // <-- scan all modules for JSDoc comments
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};
