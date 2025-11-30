import { RequestHandler } from "express";

// Definimos la estructura de lo que queremos guardar de cada ruta
export interface RouteDefinition {
  method?: "get" | "post" | "put" | "delete" | "patch";
  path?: string;
  summary?: string;
  tags?: string[];
  bodyDto?: any; // Aquí guardaremos la clase del DTO (Constructor)
  queryDto?: any; // DTO para query params
  paramsDto?: any; // DTO para route params
  handlerName: string; // El nombre del método del controlador (para depurar)
  middlewares: RequestHandler[];
}

// Este es el "Cajón Global" donde acumularemos todas las rutas
export const routeRegistry: RouteDefinition[] = [];
