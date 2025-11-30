import { DataSource } from "typeorm";
import { DateTime } from "luxon";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";
import { User } from "@/features/auth/models/user";

export class AuthFactory {
  constructor(private dataSource: DataSource) {}

  async seedEssentials() {
    const genreRepo = this.dataSource.getRepository(Genre);
    const rolRepo = this.dataSource.getRepository(Rol);

    const genre = await genreRepo.save({
      name: "Masculino",
      active: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    });

    const rol = await rolRepo.save({
      name: "Admin",
      active: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    });

    return { genre, rol };
  }

  async createUser(overrides: Partial<User> = {}) {
    const userRepo = this.dataSource.getRepository(User);
    const genreRepo = this.dataSource.getRepository(Genre);
    const rolRepo = this.dataSource.getRepository(Rol);

    const genre = await genreRepo.findOneBy({ name: "Masculino" });
    const rol = await rolRepo.findOneBy({ name: "Admin" });

    if (!genre || !rol) {
      throw new Error("Essentials not seeded");
    }

    // Valores por defecto
    const defaultUser = {
      id: "test001",
      firstName: "Test",
      secondName: "User",
      firstLastname: "Last",
      secondLastname: "Name",
      username: "testuser",
      email: "test@example.com",
      password: "password",
      genre: genre,
      rol: rol,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    };

    return userRepo.save({ ...defaultUser, ...overrides });
  }

  getValidUserDto(genreId: number = 1, rolId: number = 1) {
    return {
      firstName: "Jesid",
      secondName: "Alberto",
      firstLastname: "Polo",
      secondLastname: "Vargas",
      username: "jesidpolo",
      email: "jesid@example.com",
      password: "password123",
      genreId,
      rolId,
    };
  }
}
