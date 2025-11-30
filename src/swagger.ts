import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import { routeRegistry } from "@/decorators/metada.registry";

// Importamos los controladores para que el código se ejecute y los decoradores se registren
import "@/features/auth/controllers/auth.controller";
import { logger } from "@/logging";
import { th } from "zod/locales";

export function generateSwaggerSpec() {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: "#/components/schemas/",
  });

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
    if (!route.path || !route.method) {
      throw new Error("paths is undefined or null");
    }
    if (!swaggerDoc.paths[route.path]) {
      swaggerDoc.paths[route.path] = {};
    }

    // Convertimos el path de Express (/users/:id) a Swagger (/users/{id}) si fuera necesario
    const swaggerPath = route.path.replace(/:(\w+)/g, "{$1}");

    // Construimos la operación (POST, GET, etc.)
    const operation: any = {
      summary: route.summary,
      tags: ["General"], // Podrías agregar tags en el decorador también
      parameters: [],
      responses: {
        200: { description: "Operación exitosa" },
        400: { description: "Error de validación" },
      },
    };

    // Helper para agregar parámetros desde DTOs (Query y Params)
    const addParameters = (dtoClass: any, inType: "query" | "path") => {
      if (!dtoClass) return;
      const dtoName = dtoClass.name;
      const schema = schemas[dtoName];
      if (schema && schema.properties) {
        Object.entries(schema.properties).forEach(([propName, propSchema]) => {
          operation.parameters.push({
            name: propName,
            in: inType,
            required: schema.required?.includes(propName) || inType === "path",
            schema: propSchema,
          });
        });
      }
    };

    addParameters(route.queryDto, "query");
    addParameters(route.paramsDto, "path");

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
