import { Server } from "./server";
import { envs } from "./envs";
import { initializeDatabase } from "./database/postgres.config";

/* Init database */
initializeDatabase();

/* Init server */
const server = new Server();
const port: number = envs.PORT ?? 3000;
server.listen(port);
