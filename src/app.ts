import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { PriceController } from "./controllers/DseController";
import { GlobalErrorHandler } from "./middlewares/ErrorMiddleware";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

useContainer(Container);

const app = express();

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bangladesh Stock Market Data API',
      version: '1.0.0',
      description: 'API for retrieving stock market data from Dhaka Stock Exchange (DSE)',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: ['./src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cors());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create Express server with routing-controllers
const expressApp = createExpressServer({
  controllers: [PriceController],
  middlewares: [GlobalErrorHandler],
});

// Use the routing-controllers app as middleware in the express app
app.use(expressApp);

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
