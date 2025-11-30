import "reflect-metadata";
import request from "supertest";
import { UserController } from "@/features/auth/controllers/auth.controller";
import { TestEnvironment } from "@/__tests__/helpers/setup/test-environment";
import { AuthFactory } from "@/__tests__/helpers/factories/auth.factory";
import { Genre } from "@/features/auth/models/genre";
import { Rol } from "@/features/auth/models/rol";

describe("Auth E2E Tests", () => {
  const env = new TestEnvironment();
  let factory: AuthFactory;
  let genre: Genre;
  let rol: Rol;

  beforeAll(async () => {
    await env.initialize([UserController]);
    factory = new AuthFactory(env.dataSource);
  });

  afterAll(async () => {
    await env.destroy();
  });

  beforeEach(async () => {
    await env.clearDatabase();
    const seeds = await factory.seedEssentials();
    genre = seeds.genre;
    rol = seeds.rol;
  });

  describe("POST /hello-world (Create User)", () => {
    it("should create a new user successfully", async () => {
      const newUserDto = factory.getValidUserDto(genre.id, rol.id);

      const response = await request(env.app)
        .post("/api/users")
        .send(newUserDto)
        .expect(201);

      expect(response.body).toMatchObject({
        email: newUserDto.email,
        username: newUserDto.username,
        genre: { id: genre.id },
        rol: { id: rol.id },
      });
    });

    it("should fail if email already exists", async () => {
      // Arrange: Crear usuario existente usando el factory
      await factory.createUser({ email: "existing@example.com" });

      // Act: Intentar crear otro con el mismo email
      const newUserDto = factory.getValidUserDto(genre.id, rol.id);
      newUserDto.email = "existing@example.com";

      // Assert
      await request(env.app).post("/api/users").send(newUserDto).expect(500); // O el código de error que manejes para duplicados
    });

    it("should fail validation if data is invalid", async () => {
      const invalidDto = { firstName: "J", email: "not-an-email" };

      await request(env.app).post("/api/users").send(invalidDto).expect(400);
    });
  });
});
