import { DataSource } from "typeorm";
import { newDb } from "pg-mem";
import { Student } from "@/entities";
import { Server } from "@/server";
import express from "express";

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
    entities: [Student],
  });

  await dataSource.initialize();
  await dataSource.synchronize();

  return dataSource;
}

export async function createTestApp(): Promise<express.Application> {
  const dataSource = await createTestDataSource();
  const server = new Server(dataSource);
  return server.getApp();
}
