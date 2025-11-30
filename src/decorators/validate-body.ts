import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { RouteDefinition, routeRegistry } from "@/decorators/metada.registry";

// Definimos un tipo para el constructor de la clase DTO
type Constructor<T = any> = new (...args: any[]) => T;

export function ValidateBody(dtoClass: Constructor) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let route = routeRegistry.find((r) => r.handlerName === propertyKey);
    if (!route) {
      route = { handlerName: propertyKey } as RouteDefinition;
      routeRegistry.push(route);
    }
    route.bodyDto = dtoClass;

    // Guardamos el método original del controlador
    const originalMethod = descriptor.value;

    // Reemplazamos el método con nuestra versión "envuelta"
    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      // 1. Transformar el body plano a una instancia de la clase DTO
      if (!req.body) {
        return res.status(400).json({
          status: "error",
          message: "Request body is missing",
        });
      }
      const output = plainToInstance(dtoClass, req.body);

      // 2. Validar
      const errors = await validate(output);

      // 3. Si hay errores, devolver 400 y detener la ejecución
      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints || {}).join(", ")
        );

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errorMessages,
        });
      }

      // 4. (Opcional) Reemplazar req.body con el objeto tipado y limpio
      req.body = output;

      // 5. Ejecutar el método original del controlador
      // Usamos .apply(this) para no perder el contexto de la clase
      return originalMethod.apply(this, [req, res, next]);
    };

    return descriptor;
  };
}
