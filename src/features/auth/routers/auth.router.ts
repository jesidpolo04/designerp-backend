import { Router } from "express";

import { UserController } from "../controllers/auth.controller";

const authRouter = Router();
const userController = new UserController();

authRouter.post("/users", userController.createUser.bind(userController));

export { authRouter };
