import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val))
    .optional(),

  DB_HOST: z.string(),
  DB_PORT: z.string().transform((val) => Number.parseInt(val)),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  POOL_MAX_CONNECTIONS: z.string().transform((val) => Number.parseInt(val)),

  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("1h"),
});

const envs = envSchema.parse(process.env);

export { envs, envSchema };
