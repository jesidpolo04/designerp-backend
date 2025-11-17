import { Router } from "express";

export const appRouter = Router();

// Import other route modules
import { studentRouter } from "@/modules/student/student.router";

appRouter.use("/api/students", studentRouter);
