// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Food App API',
      version: '1.0.0',
      description: 'API documentation for the Food App backend.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};


const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi, swaggerSpec };
