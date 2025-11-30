import { Request, Response, NextFunction, RequestHandler } from "express";
import { runWithContext } from "../logging";
import { randomUUID } from "crypto";

export const contextMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();

  const context = {
    requestId,
  };

  // Devolvemos el ID al cliente
  res.setHeader("x-request-id", requestId);

  runWithContext(context, () => {
    next();
  });
};
