import { Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { Post, ValidateBody } from "@/decorators";
import { LoginDto } from "@/features/auth/dtos/login.dto";
import { LoginUseCase } from "@/features/auth/use-cases/login.use-case";
import { logger } from "@/logging";

@injectable()
export class SessionController {
  constructor(@inject(LoginUseCase) private loginUseCase: LoginUseCase) {}

  @Post("/api/auth/login", "Inicia sesión en el sistema")
  @ValidateBody(LoginDto)
  async login(req: Request<unknown, unknown, LoginDto>, res: Response) {
    logger.info(`Login attempt for email: ${req.body.email}`);

    try {
      const result = await this.loginUseCase.execute(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      logger.error(error, "Login failed");
      return res.status(401).json({
        status: "error",
        message: error.message || "Authentication failed",
      });
    }
  }
}
