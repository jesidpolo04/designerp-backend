import { Request, Response } from "express";
import { Post, ValidateBody } from "@/decorators";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import { Use } from "@/decorators/use";
import { contextMiddleware } from "@/middlewares/context.middleware";
import { addContext, logger } from "@/logging";

export class UserController {
  @Post("/hello-world", "Crea un nuevo usuario en el sistema")
  @ValidateBody(CreateUserDto)
  @Use(contextMiddleware)
  async createUser(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ) {
    const { email, name } = req.body;
    addContext({ userEmail: email });
    logger.debug(`Creating user with email: ${email} and name: ${name}`);

    return res.status(201).json({
      success: true,
      data: { email, name },
    });
  }
}
