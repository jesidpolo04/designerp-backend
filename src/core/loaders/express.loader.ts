import { Application, Request, Response, NextFunction } from "express";
import { routeRegistry } from "@/decorators/metada.registry";

// Recibimos la app de express y una lista de CLASES de controladores
type ControllerClass = { new (...args: any[]): any };

export function registerRoutes(
  app: Application,
  controllers: ControllerClass[]
) {
  // 1. Instanciamos cada controlador
  // (Nota: Si usaras inyección de dependencias, aquí usarías container.resolve)
  const instances = controllers.map((CtrlClass) => new CtrlClass());

  // 2. Recorremos nuestro registro de metadatos
  routeRegistry.forEach((route) => {
    // 3. Buscamos qué instancia tiene el método que decoramos
    // (Buscamos en el prototipo si existe la función con ese nombre)
    const controllerInstance = instances.find(
      (inst) => inst[route.handlerName]
    );

    if (controllerInstance) {
      // 4. Obtenemos la función original y la "bindeamos" para no perder el 'this'
      const handler =
        controllerInstance[route.handlerName].bind(controllerInstance);
      const routeMiddlewares = route.middlewares || [];

      // 5. ¡AQUÍ OCURRE LA MAGIA!
      // Ejecutamos app.get(), app.post(), etc. dinámicamente
      if (!route.method) {
        throw new Error(
          `Route method is not defined for handler ${route.handlerName}`
        );
      }
      if (!route.path) {
        throw new Error(
          `Route path is not defined for handler ${route.handlerName}`
        );
      }
      app[route.method](
        route.path,
        ...routeMiddlewares,
        async (req: Request, res: Response, next: NextFunction) => {
          try {
            await handler(req, res, next);
          } catch (error) {
            next(error);
          }
        }
      );
    }
  });
}
