import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Post, ValidateBody, ValidateQuery } from "@/decorators";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import { Use } from "@/decorators/use";
import { contextMiddleware } from "@/middlewares/context.middleware";
import { logger } from "@/logging";
import { CreateUserUseCase } from "@/features/auth/use-cases/create-user.use-case";
import { IsString } from "class-validator";

export class QueryDto {
  @IsString()
  search!: string;
}

@injectable()
export class UserController {
  constructor(
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase
  ) {}

  @Post("/api/users", "Crea un nuevo usuario en el sistema")
  @ValidateBody(CreateUserDto)
  @ValidateQuery(QueryDto)
  @Use(contextMiddleware)
  async createUser(
    req: Request<unknown, unknown, CreateUserDto, QueryDto>,
    res: Response
  ) {
    logger.info(req.body, `Creating a new user with email: ${req.body.email}`);
    logger.info(req.query, `Query parameters: ${req.query.search}`);
    const user = await this.createUserUseCase.execute(req.body);

    return res.status(201).json(user);
  }
}
