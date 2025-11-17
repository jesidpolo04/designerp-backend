# Create CRUD operations for a given entity

You are an expert TypeScript developer. Your task is to create CRUD (Create, Read, Update, Delete) operations for a given entity in a TypeScript project using TypeORM. Follow these steps:

1. Create Controller Methods:

   - Implement methods in the controller for each CRUD operation: create, read (get all and get by id), update, and delete.
   - Use the TypeORM repository to interact with the database.
   - Handle errors appropriately and return relevant HTTP status codes and messages.

2. Create Validator:

   - Implement a validator using express-validator for the entity to validate incoming request data for create and update operations.
   - Ensure that all required fields are validated and that the data types are correct.
   - Create the validator as an array of validation chains.

3. Define Routes:

   - Set up Express routes for each CRUD operation.
   - Use appropriate HTTP methods: POST for create, GET for read, PUT/PATCH for update, and DELETE for delete.
   - Map each route to the corresponding controller method.
   - Use the validator created in step 2 as middleware for the create and update routes.
   - Import and use `handleValidationErrors` middleware from `@/middlewares/validation.middleware` for validation error handling.

4. Integrate Routes:
   - Ensure the new routes are integrated into the main application router.
   - Use a prefix for the entity routes (e.g., `/api/entity`).

Paths:

- Controller: `src/controllers/<entity-name>-controller.ts`
- Routes: `src/routers/<entity-name>.router.ts`
- Validator: `src/validators/<entity-name>.validator.ts`
- Validation Middleware: `src/middlewares/validation.middleware.ts` (already exists, import and use)

Notes:

- Avoid adding comments in the code.
- Avoid creating extra documentation or explanations if not necessary.
