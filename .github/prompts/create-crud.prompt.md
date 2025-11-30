# Create CRUD operations for a given entity

You are an expert TypeScript developer. Your task is to create CRUD (Create, Read, Update, Delete) operations for a given entity in a TypeScript project using TypeORM, tsyringe, and Express. Follow these steps strictly:

## Step 1: Create the Entity

Create the entity class using TypeORM decorators.

- **Reference**: See `src/features/auth/models/user.ts`.
- **Requirements**:
  - Use `luxonTransformer` for `DateTime` columns (created_at, updated_at).
  - Initialize `@Column` decorators with at least the `type` attribute.
  - Implement `@BeforeInsert` and `@BeforeUpdate` hooks to manage `createdAt` and `updatedAt` automatically.
  - Use `@Entity({ name: 'table_name' })`.

## Step 2: Create the DTO

Create a Data Transfer Object (DTO) for the creation/update use cases.

- **Reference**: See `src/features/auth/dtos/create-user.dto.ts`.
- **Requirements**:
  - Use `class-validator` decorators (`@IsString`, `@IsInt`, `@IsEmail`, `@MaxLength`, etc.) to validate fields.

## Step 3: Create the Use Case

Create a Use Case service to handle the business logic.

- **Reference**: See `src/features/auth/use-cases/create-user.use-case.ts`.
- **Requirements**:
  - Use `@injectable()` from `tsyringe`.
  - Inject repositories using `@inject(TOKEN)`.
  - Implement an `execute` method that accepts the DTO.
  - Handle business logic (validations, relation checks) before saving to the database.

## Step 4: Create the Controller

Create the controller to handle HTTP requests.

- **Reference**: See `src/features/auth/controllers/auth.controller.ts`.
- **Requirements**:
  - Use custom decorators: `@ApiRoute` (or `@Post`, `@Get`, etc.), `@Use` (for middlewares), and `@ValidateBody`.
  - Inject the Use Case in the constructor.
  - Return appropriate HTTP responses.
  - **Registration**: If this is a new controller, ensure it is registered in `src/main.ts` via `server.registerRoutes([...])`.

## Step 5: Create E2E Tests

Create End-to-End tests to verify the correctness of each endpoint.

- **Reference**: See `src/__tests__/auth.e2e.test.ts`.
- **Requirements**:
  - Use `TestEnvironment` helper to setup the test database and server.
  - Use or create a Factory (like `AuthFactory`) to generate test data and handle seeding.
  - Test success scenarios (200/201 status codes).
  - Test failure scenarios (400/404/500 status codes).
  - Verify the response body matches the expected structure.

Notes:

- Follow the existing project structure and naming conventions.
- Ensure all dependencies are properly imported.
