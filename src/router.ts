import { Router } from "express";

export const appRouter = Router();

// Import other route modules
import { studentRouter } from "@/modules/student/student.router";
import { addContext, logger } from "./logging";

appRouter.get("/hello-world", (req, res) => {
  addContext({ uribe: "paraco" });
  logger.info("Hello world endpoint was called");
  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      logger.info("Async operation completed");
      resolve();
    }, 1000);
  });
  res.send("Welcome to the API");
});
appRouter.use("/api/students", studentRouter);
