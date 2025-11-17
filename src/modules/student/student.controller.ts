import { Request, Response } from "express";
import { Repository, DataSource } from "typeorm";
import { AppDataSource } from "@/database/postgres.config";
import { Student } from "./student.entity";
import { logger } from "@/logging";

class StudentController {
  constructor(
    private readonly studentRepository: Repository<Student>
  ) {}

  // GET /students - Get all students
  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const students = await this.studentRepository.find();

      return res.json({
        success: true,
        data: students,
        count: students.length,
      });
    } catch (error) {
      logger.error(error, "Error fetching students:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener estudiantes",
      });
    }
  }

  // GET /students/:id - Get student by ID
  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const student = await this.studentRepository.findOne({
        where: { id: Number.parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Estudiante no encontrado",
        });
      }

      return res.json({
        success: true,
        data: student,
      });
    } catch (error) {
      logger.error(error, "Error fetching student:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al obtener el estudiante",
      });
    }
  }

  // POST /students - Create new student
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const {
        firstName,
        secondName,
        lastName,
        secondLastName,
        isRetired = false,
      } = req.body;

      const student = this.studentRepository.create({
        firstName,
        secondName,
        lastName,
        secondLastName,
        isRetired,
      });

      const savedStudent = await this.studentRepository.save(student);

      return res.status(201).json({
        success: true,
        message: "Estudiante creado exitosamente",
        data: savedStudent,
      });
    } catch (error) {
      logger.error(error, "Error creating student:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al crear el estudiante",
      });
    }
  }

  // PUT /students/:id - Update student
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const student = await this.studentRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Estudiante no encontrado",
        });
      }

      // Update student
      await this.studentRepository.update(Number.parseInt(id), updateData);

      // Fetch updated student
      const updatedStudent = await this.studentRepository.findOne({
        where: { id: Number.parseInt(id) },
      });

      return res.json({
        success: true,
        message: "Estudiante actualizado exitosamente",
        data: updatedStudent,
      });
    } catch (error) {
      logger.error(error, "Error updating student:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al actualizar el estudiante",
      });
    }
  }

  // DELETE /students/:id - Delete student
  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const student = await this.studentRepository.findOne({
        where: { id: parseInt(id) },
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Estudiante no encontrado",
        });
      }

      await this.studentRepository.remove(student);

      return res.json({
        success: true,
        message: "Estudiante eliminado exitosamente",
      });
    } catch (error) {
      logger.error(error, "Error deleting student:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al eliminar el estudiante",
      });
    }
  }

  async filter(req: Request, res: Response): Promise<Response> {
    try {
      const { isRetired } = req.query;
      const where: any = {};

      if (isRetired !== undefined) {
        where.isRetired = isRetired === "true";
      }

      const students = await this.studentRepository.find({
        where,
      });

      return res.json({
        success: true,
        data: students,
        count: students.length,
      });
    } catch (error) {
      logger.error(error, "Error filtering students:");
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor al filtrar estudiantes",
      });
    }
  }
}

// Factory function to create controller with specific DataSource
export function createStudentController(dataSource: DataSource = AppDataSource): StudentController {
  const studentRepository = dataSource.getRepository(Student);
  return new StudentController(studentRepository);
}

// Default export for production use
export default createStudentController();
