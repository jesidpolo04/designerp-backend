import { Request, Response } from "express";
import { Post, ValidateBody } from "@/decorators";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import { Use } from "@/decorators/use";
import { contextMiddleware } from "@/middlewares/context.middleware";
import { addContext, logger } from "@/logging";
import { CreateUserUseCase } from "@/features/auth/use-cases/create-user.use-case";
import { AppDataSource } from "@/database/postgres.config";
import { User } from "@/features/auth/models/user";
import { Rol } from "@/features/auth/models/rol";
import { Genre } from "@/features/auth/models/genre";

export class UserController {
  @Post("/hello-world", "Crea un nuevo usuario en el sistema")
  @ValidateBody(CreateUserDto)
  @Use(contextMiddleware)
  async createUser(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ) {
    logger.info(req.body, `Creating a new user with email: ${req.body.email}`);
    AppDataSource.getRepository(User);
    AppDataSource.getRepository(Genre);
    AppDataSource.getRepository(Rol);

    const createUserUseCase = new CreateUserUseCase(
      AppDataSource.getRepository(User),
      AppDataSource.getRepository(Genre),
      AppDataSource.getRepository(Rol)
    );
    const user = await createUserUseCase.execute(req.body);

    return res.status(201).json(user);
  }
}
