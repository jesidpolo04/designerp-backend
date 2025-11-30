import { Request, Response } from "express";
import { injectable } from "tsyringe";
import { Post, ValidateBody } from "@/decorators";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import { Use } from "@/decorators/use";
import { contextMiddleware } from "@/middlewares/context.middleware";
import { logger } from "@/logging";
import { CreateUserUseCase } from "@/features/auth/use-cases/create-user.use-case";

@injectable()
export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post("/api/users", "Crea un nuevo usuario en el sistema")
  @ValidateBody(CreateUserDto)
  @Use(contextMiddleware)
  async createUser(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ) {
    logger.info(req.body, `Creating a new user with email: ${req.body.email}`);

    const user = await this.createUserUseCase.execute(req.body);

    return res.status(201).json(user);
  }
}
