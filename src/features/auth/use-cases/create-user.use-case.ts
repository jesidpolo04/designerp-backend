import { Repository } from "typeorm";
import { nanoid } from "nanoid";
import { injectable, inject } from "tsyringe";
import { DateTime } from "luxon";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";
import {
  USER_REPOSITORY,
  GENRE_REPOSITORY,
  ROL_REPOSITORY,
} from "@/core/di/tokens";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject(USER_REPOSITORY) private readonly userRepository: Repository<User>,
    @inject(GENRE_REPOSITORY)
    private readonly genreRepository: Repository<Genre>,
    @inject(ROL_REPOSITORY) private readonly rolRepository: Repository<Rol>
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // 1. Verificar si el usuario o email ya existen
    const existingUser = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });

    if (existingUser) {
      throw new Error("El usuario o correo electrónico ya existe");
    }

    // 2. Buscar relaciones
    const genre = await this.genreRepository.findOneBy({ id: dto.genreId });
    if (!genre) {
      throw new Error("El género especificado no existe");
    }

    const rol = await this.rolRepository.findOneBy({ id: dto.rolId });
    if (!rol) {
      throw new Error("El rol especificado no existe");
    }

    // 3. Crear la entidad
    const newUser = this.userRepository.create({
      id: nanoid(7),
      firstName: dto.firstName,
      secondName: dto.secondName,
      firstLastname: dto.firstLastname,
      secondLastname: dto.secondLastname,
      username: dto.username,
      email: dto.email,
      password: dto.password, // TODO: Hashear contraseña
      genre: genre,
      rol: rol,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    });

    // 4. Guardar
    return await this.userRepository.save(newUser);
  }
}
