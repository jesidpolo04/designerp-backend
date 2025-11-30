import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routeRegistry } from "@/decorators/metada.registry";

// Importamos los controladores para que el código se ejecute y los decoradores se registren
import "@/features/auth/controllers/auth.controller";

export function generateSwaggerSpec() {
  // 1. Generamos los esquemas de los DTOs (Solución al error de import: sin argumentos)
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas/",
  });

  // 2. Estructura base de OpenAPI 3.0
  const swaggerDoc: any = {
    openapi: "3.0.0",
    info: {
      title: "Mi API Automatizada",
      version: "1.0.0",
    },
    paths: {}, // Aquí llenaremos las rutas dinámicamente
    components: {
      schemas: schemas, // Inyectamos los esquemas generados
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer" },
      },
    },
  };

  // 3. Recorremos nuestro registro custom y llenamos "paths"
  routeRegistry.forEach((route) => {
    // Aseguramos que el path existe en el objeto (ej: paths["/users"] = {})
    if (!swaggerDoc.paths[route.path]) {
      swaggerDoc.paths[route.path] = {};
    }

    // Convertimos el path de Express (/users/:id) a Swagger (/users/{id}) si fuera necesario
    const swaggerPath = route.path.replace(/:(\w+)/g, "{$1}");

    // Construimos la operación (POST, GET, etc.)
    const operation: any = {
      summary: route.summary,
      tags: ["General"], // Podrías agregar tags en el decorador también
      responses: {
        200: { description: "Operación exitosa" },
        400: { description: "Error de validación" },
      },
    };

    // 4. Si la ruta tiene un BodyDTO registrado, lo vinculamos con $ref
    if (route.bodyDto) {
      const dtoName = route.bodyDto.name; // Ej: "CreateUserDto"

      // Verificamos que el esquema exista (generado por class-validator-jsonschema)
      if (schemas[dtoName]) {
        operation.requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: `#/components/schemas/${dtoName}`,
              },
            },
          },
        };
      }
    }

    // Asignamos la operación al path y método correcto
    swaggerDoc.paths[swaggerPath] = {
      ...swaggerDoc.paths[swaggerPath],
      [route.method]: operation,
    };
  });

  return swaggerDoc;
}
