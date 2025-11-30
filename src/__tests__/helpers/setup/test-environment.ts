import { DataSource } from "typeorm";
import express from "express";
import { container } from "tsyringe";
import { createTestDataSource, registerTestDependencies } from "./test-app";
import { Server } from "@/server";

export class TestEnvironment {
  public app: express.Application;
  public dataSource: DataSource;

  async initialize(controllers: any[]) {
    // 1. DB
    this.dataSource = await createTestDataSource();

    // 2. DI Container
    container.clearInstances();
    registerTestDependencies(this.dataSource);

    // 3. Server
    const server = new Server(this.dataSource);
    server.registerRoutes(controllers);
    this.app = server.getApp();
  }

  async destroy() {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
    container.clearInstances();
  }

  async clearDatabase() {
    const entities = this.dataSource.entityMetadatas;
    // Order matters due to Foreign Key constraints. Delete User first.
    const sortedEntities = [...entities].sort((a, b) => {
      if (a.name === "User") return -1;
      if (b.name === "User") return 1;
      return 0;
    });

    for (const entity of sortedEntities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.createQueryBuilder().delete().execute();
    }
  }
}
