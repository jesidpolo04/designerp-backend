import { RouteDefinition, routeRegistry } from "@/decorators/metada.registry";

export function ApiRoute(
  method: RouteDefinition["method"],
  path: string,
  summary?: string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 1. Buscamos o creamos el registro
    let route = routeRegistry.find((r) => r.handlerName === propertyKey);
    if (!route) {
      route = { handlerName: propertyKey } as RouteDefinition;
      routeRegistry.push(route);
    }

    // 2. Completamos la información de HTTP
    route.method = method;
    route.path = path;
    route.summary = summary || "";
  };
}

export const Post = (path: string, summary?: string) =>
  ApiRoute("post", path, summary);
export const Get = (path: string, summary?: string) =>
  ApiRoute("get", path, summary);
