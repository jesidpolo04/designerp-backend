import express from "express";
import cors from "cors";
import { DataSource } from "typeorm";
import { appRouter } from "@/router";
import { logger } from "./logging";
import { contextMiddleware } from "./middlewares/context.middleware";

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

    this.app.use(appRouter);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      logger.info(`Server is running on http://localhost:${port}`);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
