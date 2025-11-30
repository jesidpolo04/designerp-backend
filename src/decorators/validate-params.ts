import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { RouteDefinition, routeRegistry } from "@/decorators/metada.registry";

type Constructor<T = any> = new (...args: any[]) => T;

export function ValidateParams(dtoClass: Constructor) {
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
    route.paramsDto = dtoClass;

    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const output = plainToInstance(dtoClass, req.params);
      const errors = await validate(output);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints || {}).join(", ")
        );

        return res.status(400).json({
          status: "error",
          message: "Params validation failed",
          errors: errorMessages,
        });
      }

      // req.params might be a getter-only property in some environments
      try {
        req.params = output as any;
      } catch (error) {
        // Fallback: define property if assignment fails
        Object.defineProperty(req, "params", {
          value: output,
          writable: true,
          configurable: true,
        });
      }

      return originalMethod.apply(this, [req, res, next]);
    };

    return descriptor;
  };
}
