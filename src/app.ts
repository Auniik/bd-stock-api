import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { createExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { PriceController } from "./controllers/DseController";
import { GlobalErrorHandler } from "./middlewares/ErrorMiddleware";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

useContainer(Container);

const app = express();


// Middleware for parsing JSON bodies
app.use(express.json());
app.use(cors());

// Create Express server with routing-controllers
const expressApp = createExpressServer({
  controllers: [PriceController],
  middlewares: [GlobalErrorHandler],
});

// Swagger UI with dynamic server URL
app.use("/api-docs", swaggerUi.serve, (req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;
  
  const dynamicSwaggerDoc = {
    ...swaggerDocument,
    servers: [
      {
        url: baseUrl,
        description: "Current server"
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server"
      }
    ]
  };
  
  swaggerUi.setup(dynamicSwaggerDoc)(req, res, next);
});

// Use the routing-controllers app as middleware in the express app
app.use(expressApp);



// Start the Express server locally
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

