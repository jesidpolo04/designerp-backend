import request from "supertest";
import express from "express";
import { DataSource } from "typeorm";
import { createTestDataSource } from "./helpers/test-app";
import { Server } from "@/server";
import { Student } from "@/entities";

describe("Student E2E Tests", () => {
  let app: express.Application;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Create test database and app
    dataSource = await createTestDataSource();
    const server = new Server(dataSource);
    app = server.getApp();
  });

  afterAll(async () => {
    // Close database connection
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    // Clear data before each test
    const studentRepo = dataSource.getRepository(Student);
    await studentRepo.clear();
  });

  describe("POST /api/students", () => {
    it("should create a new student", async () => {
      const newStudent = {
        firstName: "Juan",
        secondName: "Carlos",
        lastName: "Pérez",
        secondLastName: "González",
        isRetired: false,
      };

      const response = await request(app)
        .post("/api/students")
        .send(newStudent)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Estudiante creado exitosamente");
      expect(response.body.data).toMatchObject({
        firstName: "Juan",
        secondName: "Carlos",
        lastName: "Pérez",
        secondLastName: "González",
        isRetired: false,
      });
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
    });

    it("should fail when firstName is missing", async () => {
      const invalidStudent = {
        lastName: "Pérez",
        isRetired: false,
      };

      await request(app).post("/api/students").send(invalidStudent).expect(400);
    });
  });

  describe("GET /api/students", () => {
    it("should return empty array when no students exist", async () => {
      const response = await request(app).get("/api/students").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it("should return all students", async () => {
      // Create test students
      const studentRepo = dataSource.getRepository(Student);
      await studentRepo.save(
        studentRepo.create([
          {
            firstName: "Ana",
            lastName: "Martínez",
            secondName: null,
            secondLastName: null,
            isRetired: false,
          },
          {
            firstName: "Pedro",
            lastName: "López",
            secondName: null,
            secondLastName: null,
            isRetired: true,
          },
        ])
      );

      const response = await request(app).get("/api/students").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });

  describe("GET /api/students/:id", () => {
    it("should return a student by id", async () => {
      // Create a test student
      const studentRepo = dataSource.getRepository(Student);
      const student = await studentRepo.save(
        studentRepo.create({
          firstName: "María",
          lastName: "García",
          secondName: null,
          secondLastName: null,
          isRetired: false,
        })
      );

      const response = await request(app)
        .get(`/api/students/${student.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(student.id);
      expect(response.body.data.firstName).toBe("María");
    });

    it("should return 404 when student not found", async () => {
      const response = await request(app).get("/api/students/9999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Estudiante no encontrado");
    });
  });

  describe("PUT /api/students/:id", () => {
    it("should update a student", async () => {
      // Create a test student
      const studentRepo = dataSource.getRepository(Student);
      const student = await studentRepo.save(
        studentRepo.create({
          firstName: "Carlos",
          lastName: "Rodríguez",
          secondName: null,
          secondLastName: null,
          isRetired: false,
        })
      );

      const updateData = {
        firstName: "Carlos Alberto",
        isRetired: true,
      };

      const response = await request(app)
        .put(`/api/students/${student.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe("Carlos Alberto");
      expect(response.body.data.isRetired).toBe(true);
    });

    it("should return 404 when updating non-existent student", async () => {
      const response = await request(app)
        .put("/api/students/9999")
        .send({ firstName: "Test" })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/students/:id", () => {
    it("should delete a student", async () => {
      // Create a test student
      const studentRepo = dataSource.getRepository(Student);
      const student = await studentRepo.save(
        studentRepo.create({
          firstName: "Luis",
          lastName: "Fernández",
          secondName: null,
          secondLastName: null,
          isRetired: false,
        })
      );

      const response = await request(app)
        .delete(`/api/students/${student.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Estudiante eliminado exitosamente");

      // Verify student was deleted
      const deletedStudent = await studentRepo.findOne({
        where: { id: student.id },
      });
      expect(deletedStudent).toBeNull();
    });

    it("should return 404 when deleting non-existent student", async () => {
      const response = await request(app)
        .delete("/api/students/9999")
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/students/filter", () => {
    it("should filter students by isRetired", async () => {
      // Create test students
      const studentRepo = dataSource.getRepository(Student);
      await studentRepo.save(
        studentRepo.create([
          {
            firstName: "Active",
            lastName: "Student",
            secondName: null,
            secondLastName: null,
            isRetired: false,
          },
          {
            firstName: "Retired",
            lastName: "Student",
            secondName: null,
            secondLastName: null,
            isRetired: true,
          },
        ])
      );

      const response = await request(app)
        .get("/api/students/filter?isRetired=true")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].firstName).toBe("Retired");
    });
  });
});
