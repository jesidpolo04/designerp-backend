import { Request, Response } from "express";
import { Post, ValidateBody } from "@/decorators";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import { Use } from "@/decorators/use";
import { contextMiddleware } from "@/middlewares/context.middleware";

export class UserController {
  @Post("/hello-world", "Crea un nuevo usuario en el sistema")
  @ValidateBody(CreateUserDto)
  @Use(contextMiddleware)
  async createUser(
    req: Request<unknown, unknown, CreateUserDto>,
    res: Response
  ) {
    const { email, name } = req.body;

    console.log(`Creando usuario: ${name}`);

    return res.status(201).json({
      success: true,
      data: { email, name },
    });
  }
}
