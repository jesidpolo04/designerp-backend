import { DataSource } from "typeorm";
import { newDb } from "pg-mem";
import { container } from "tsyringe";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { Server } from "@/server";
import express from "express";
import {
  USER_REPOSITORY,
  GENRE_REPOSITORY,
  ROL_REPOSITORY,
} from "@/core/di/tokens";

export async function createTestDataSource(): Promise<DataSource> {
  const db = newDb();

  // Register common SQL functions for TypeORM compatibility
  db.public.registerFunction({
    name: "current_database",
    implementation: () => "test_db",
  });

  db.public.registerFunction({
    name: "current_timestamp",
    implementation: () => new Date(),
  });

  db.public.registerFunction({
    name: "version",
    implementation: () => "PostgreSQL 14.0 (pg-mem)",
  });

  const dataSource = await db.adapters.createTypeormDataSource({
    type: "postgres",
    entities: [User, Genre, Rol],
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  return dataSource;
}

export function registerTestDependencies(dataSource: DataSource) {
  container.register(USER_REPOSITORY, {
    useValue: dataSource.getRepository(User),
  });

  container.register(GENRE_REPOSITORY, {
    useValue: dataSource.getRepository(Genre),
  });

  container.register(ROL_REPOSITORY, {
    useValue: dataSource.getRepository(Rol),
  });
}

export async function createTestApp(): Promise<express.Application> {
  const dataSource = await createTestDataSource();
  registerTestDependencies(dataSource);
  const server = new Server(dataSource);
  return server.getApp();
}
