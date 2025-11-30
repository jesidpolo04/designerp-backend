import { container } from "tsyringe";
import { AppDataSource } from "@/database/postgres.config";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { USER_REPOSITORY, GENRE_REPOSITORY, ROL_REPOSITORY } from "./tokens";
import { UserController } from "@/features/auth/controllers/auth.controller";
import { CreateUserUseCase } from "@/features/auth/use-cases/create-user.use-case";

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
  container.register(CreateUserUseCase, { useClass: CreateUserUseCase });

  container.register(UserController, { useClass: UserController });
}
