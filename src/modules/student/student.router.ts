import { Router, Request, Response } from "express";
import { createStudentController } from "./student.controller";
import {
  createStudentValidator,
  updateStudentValidator,
} from "@/modules/student/student.validator";
import { handleValidationErrors } from "@/middlewares/validation.middleware";
import { AppDataSource } from "@/database/postgres.config";

const studentRouter = Router();

// Middleware to get controller instance with the correct DataSource
function getController(req: Request) {
  const dataSource = req.app.locals.dataSource || AppDataSource;
  return createStudentController(dataSource);
}

// GET /api/students - Get all students
studentRouter.get("/", (req: Request, res: Response) => {
  return getController(req).getAll(req, res);
});

// GET /api/students/filter - Filter students
studentRouter.get("/filter", (req: Request, res: Response) => {
  return getController(req).filter(req, res);
});

// GET /api/students/:id - Get student by ID
studentRouter.get("/:id", (req: Request, res: Response) => {
  return getController(req).getById(req, res);
});

// POST /api/students - Create new student
studentRouter.post(
  "/",
  createStudentValidator,
  handleValidationErrors,
  (req: Request, res: Response) => {
    return getController(req).create(req, res);
  }
);

// PUT /api/students/:id - Update student
studentRouter.put(
  "/:id",
  updateStudentValidator,
  handleValidationErrors,
  (req: Request, res: Response) => {
    return getController(req).update(req, res);
  }
);

// DELETE /api/students/:id - Delete student
studentRouter.delete("/:id", (req: Request, res: Response) => {
  return getController(req).delete(req, res);
});

export { studentRouter };
