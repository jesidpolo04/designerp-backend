import { container } from "tsyringe";
import { AppDataSource } from "@/database/postgres.config";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import {
  USER_REPOSITORY,
  GENRE_REPOSITORY,
  ROL_REPOSITORY,
} from "@/core/di/tokens";
import { UserController } from "@/features/auth/controllers/auth.controller";
import { SessionController } from "@/features/auth/controllers/session.controller";
import { CreateUserUseCase } from "@/features/auth/use-cases/create-user.use-case";
import { LoginUseCase } from "@/features/auth/use-cases/login.use-case";

export function registerAuthDependencies() {
  // Repositories
  container.register(USER_REPOSITORY, {
    useValue: AppDataSource.getRepository(User),
  });

  container.register(GENRE_REPOSITORY, {
    useValue: AppDataSource.getRepository(Genre),
  });

  container.register(ROL_REPOSITORY, {
    useValue: AppDataSource.getRepository(Rol),
  });

  // Use Cases
  container.register(CreateUserUseCase, { useClass: CreateUserUseCase });
  container.register(LoginUseCase, { useClass: LoginUseCase });

  // Controllers
  container.register(UserController, { useClass: UserController });
  container.register(SessionController, { useClass: SessionController });
}
