import { Repository } from "typeorm";
import { injectable, inject } from "tsyringe";
import { User } from "@/features/auth/models/user";
import { LoginDto } from "@/features/auth/dtos/login.dto";
import { USER_REPOSITORY } from "@/core/di/tokens";
import { JwtService } from "@/core/services/jwt.service";

@injectable()
export class LoginUseCase {
  constructor(
    @inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async execute(dto: LoginDto): Promise<{ token: string; user: User }> {
    // 1. Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ["genre", "rol"],
    });

    if (!user) {
      throw new Error("Credenciales inválidas");
    }

    // 2. Verificar contraseña
    // TODO: Implementar comparación de hash (bcrypt/argon2)
    if (user.password !== dto.password) {
      throw new Error("Credenciales inválidas");
    }

    // 3. Generar token
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      rol: user.rol.name,
    });

    return { token, user };
  }
}
