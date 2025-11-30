import { Repository } from "typeorm";
import { nanoid } from "nanoid";
import { AppDataSource } from "@/database/postgres.config";
import { User } from "@/features/auth/models/user";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { CreateUserDto } from "@/features/auth/dtos/create-user.dto";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly genreRepository: Repository<Genre>,
    private readonly rolRepository: Repository<Rol>
  ) {
    this.userRepository = AppDataSource.getRepository(User);
    this.genreRepository = AppDataSource.getRepository(Genre);
    this.rolRepository = AppDataSource.getRepository(Rol);
  }

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
    });

    // 4. Guardar
    return await this.userRepository.save(newUser);
  }
}
