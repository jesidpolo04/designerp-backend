import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { DataSource } from "typeorm";
import { logger } from "./logging";
import { contextMiddleware } from "./middlewares/context.middleware";
import { registerRoutes as routesLoader } from "@/core/loaders/express.loader";
import { generateSwaggerSpec } from "./swagger";

export class Server {
  private readonly app: express.Application;

  constructor(dataSource?: DataSource) {
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(contextMiddleware);

    // Store dataSource in app.locals for access in controllers
    if (dataSource) {
      this.app.locals.dataSource = dataSource;
    }
  }

  public registerRoutes(controllers: any[]): Server {
    // Importamos el cargador de rutas
    routesLoader(this.app, controllers);
    return this;
  }

  public addSwagger(): Server {
    const swaggerSpec = generateSwaggerSpec();
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    return this;
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
      logger.info(
        `Swagger docs available at http://localhost:${port}/api-docs`
      );
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
