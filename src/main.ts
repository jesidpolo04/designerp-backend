import { Server } from "./server";
import { envs } from "./envs";
import { initializeDatabase } from "./database/postgres.config";
import { UserController } from "@/features/auth/controllers/auth.controller";

/* Init database */
initializeDatabase();

/* Init server */
const server = new Server();
const port: number = envs.PORT ?? 3000;
server.addSwagger().registerRoutes([UserController]).listen(port);
