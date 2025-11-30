import { container } from "tsyringe";
import { AppDataSource } from "@/database/postgres.config";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { USER_REPOSITORY, GENRE_REPOSITORY, ROL_REPOSITORY } from "./tokens";

export function registerDependencies() {
  container.register(USER_REPOSITORY, {
    useValue: AppDataSource.getRepository(User),
  });

  container.register(GENRE_REPOSITORY, {
    useValue: AppDataSource.getRepository(Genre),
  });

  container.register(ROL_REPOSITORY, {
    useValue: AppDataSource.getRepository(Rol),
  });
}
