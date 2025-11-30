import { RequestHandler } from "express";
import { routeRegistry, RouteDefinition } from "@/decorators/metada.registry";

// ... tus otros decoradores ...

export function Use(...middlewares: RequestHandler[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 1. Buscar o crear el registro de la ruta
    let route = routeRegistry.find((r) => r.handlerName === propertyKey);
    if (!route) {
      // Nota: inicializamos middlewares como array vacío
      route = {
        handlerName: propertyKey,
        middlewares: [],
      } as RouteDefinition;
      routeRegistry.push(route);
    }

    // 2. Si el registro ya existía pero no tenía middlewares (creado por otro decorador)
    if (!route.middlewares) {
      route.middlewares = [];
    }

    // 3. Agregamos los middlewares al inicio o al final
    // Usamos spread para agregar los nuevos a la lista existente
    route.middlewares.push(...middlewares);
  };
}
