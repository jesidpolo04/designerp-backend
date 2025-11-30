import "reflect-metadata";
import { Server } from "./server";
import { envs } from "./envs";
import { initializeDatabase } from "./database/postgres.config";
import { UserController } from "@/features/auth/controllers/auth.controller";
import { registerDependencies } from "@/core/di/register";

/* Init database */
await initializeDatabase();
registerDependencies();

/* Init server */
const server = new Server();
const port: number = envs.PORT ?? 3000;
server.addSwagger().registerRoutes([UserController]).listen(port);
