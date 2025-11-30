import { DataSource } from "typeorm";
import { envs } from "@/envs";
import { logger } from "@/logging";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { User } from "@/features/auth/models/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  username: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Genre, Rol, User],
  subscribers: [],
  migrations: [],
  poolSize: envs.POOL_MAX_CONNECTIONS,
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established successfully.");
  } catch (error) {
    logger.error("Error during database initialization:");
    throw error;
  }
};
