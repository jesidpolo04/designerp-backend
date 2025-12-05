# Prompt para Crear Nuevo Recurso CRUD

## Objetivo

Crear un recurso completo con todos los componentes necesarios para operaciones CRUD en NestJS + TypeORM + SQL Server.

## Especificaciones del Recurso

**Nombre del recurso**: `[NOMBRE_RECURSO]` (ejemplo: `User`, `Product`, `Category`)
**Campos requeridos**: `[LISTA_DE_CAMPOS]`

## Componentes a Crear

### 1. Modelo TypeORM (Entidad)

- **Ubicación**: `src/[recurso-plural]/entities/[recurso-singular].entity.ts`
- **Características**:
  - Usar decorador `@Entity({ name: 'tabla_nombre' })`
  - Primary key con `@PrimaryGeneratedColumn('increment')` (tipo `number`)
  - Campos de auditoría obligatorios:
    - `createdAt: DateTime` con `@CreateDateColumn({ name: 'created_at' })`
    - `updatedAt: DateTime` con `@UpdateDateColumn({ name: 'updated_at' })`
  - Usar `DateTime` de Luxon para todos los campos de fecha/hora
  - Importar: `import { DateTime } from 'luxon';`
  - Aplicar validaciones con decoradores de `class-validator` cuando corresponda
  - Usar `snake_case` para nombres de columnas en BD
  - Incluir campo `isActive: boolean` por defecto con `@Column({ default: true, name: 'is_active' })`

### 2. Migración TypeORM

- **Ubicación**: `src/database/migrations/[timestamp]-create-[recurso-plural].ts`
- **Características**:
  - Generar con comando: `npm run typeorm migration:generate`
  - Incluir todas las columnas definidas en la entidad
  - Usar tipos SQL Server apropiados
  - Incluir índices necesarios (unique, foreign keys, etc.)
  - Verificar que los campos DateTime se mapeen correctamente

### 3. Servicio NestJS

- **Ubicación**: `src/[recurso-plural]/[recurso-plural].service.ts`
- **Características**:
  - Decorador `@Injectable()`
  - Inyectar repositorio con `@InjectRepository([RecursoEntity])`
  - Métodos básicos CRUD:
    - `create(data: Create[Recurso]Dto): Promise<[Recurso]Entity>`
    - `findAll(filters?: any): Promise<[Recurso]Entity[]>`
    - `findOne(id: number): Promise<[Recurso]Entity>`
    - `update(id: number, data: Update[Recurso]Dto): Promise<[Recurso]Entity>`
    - `remove(id: number): Promise<void>` (soft delete usando `isActive = false`)
  - Manejo de errores con excepciones de Nest (`NotFoundException`, etc.)
  - Validaciones de negocio si aplica

### 4. Controlador NestJS

- **Ubicación**: `src/[recurso-plural]/[recurso-plural].controller.ts`
- **Características**:
  - Decorador `@Controller('[recurso-plural]')`
  - Endpoints REST completos:
    - `POST /[recurso-plural]` → `@Post()` + `@Body() createDto`
    - `GET /[recurso-plural]` → `@Get()` + query filters opcionales
    - `GET /[recurso-plural]/:id` → `@Get(':id')` + `@Param('id')`
    - `PATCH /[recurso-plural]/:id` → `@Patch(':id')` + `@Param('id')` + `@Body() updateDto`
    - `DELETE /[recurso-plural]/:id` → `@Delete(':id')` + `@Param('id')`
  - Usar DTOs para validación de entrada
  - Códigos de estado HTTP apropiados (`@HttpCode()`)
  - Transformación de respuestas si es necesario

### 5. DTOs (Data Transfer Objects)

- **Ubicación**: `src/[recurso-plural]/dto/`
- **Archivos**:
  - `create-[recurso-singular].dto.ts`
  - `update-[recurso-singular].dto.ts`
- **Características**:
  - Usar decoradores de `class-validator` para validación
  - `Update` DTO debe extender `PartialType(Create[Recurso]Dto)`
  - Excluir campos de auditoría (`id`, `createdAt`, `updatedAt`) de DTOs de entrada
  - Incluir validaciones apropiadas (`@IsString()`, `@IsOptional()`, etc.)
  - Utilizar el decorador `@ApiProperty()` de `@nestjs/swagger` para documentación automática, en los campos necesarios.

### 6. Módulo NestJS

- **Ubicación**: `src/[recurso-plural]/[recurso-plural].module.ts`
- **Características**:
  - Importar `TypeOrmModule.forFeature([[Recurso]Entity])`
  - Registrar controller y service en sus respectivos arrays
  - Exportar service si otros módulos lo necesitan
  - Importar en `AppModule`

### 7. Testing Unitario

- **Estructura de carpetas**: Replicar estructura de `src/` en carpeta `test/`
  - `test/[recurso-plural]/[recurso-plural].service.spec.ts`
  - `test/[recurso-plural]/[recurso-plural].controller.spec.ts`
- **Características del testing**:
  - Usar `@nestjs/testing` para `Test.createTestingModule()`
  - Mockear repository con `jest.fn()` o factory functions
  - Cubrir todos los métodos públicos del service y controller
  - Tests para casos exitosos y de error
  - Usar `describe` y `it` con nombres descriptivos
  - Setup y cleanup apropiados con `beforeEach` y `afterEach`
  - Verificar llamadas a métodos mockeados con `expect().toHaveBeenCalledWith()`

## Consideraciones Especiales

### Fechas y Tiempo

- **IMPORTANTE**: Usar `DateTime` de Luxon en las entidades, NO `Date` de JavaScript
- Importar: `import { DateTime } from 'luxon';`
- TypeORM manejará la conversión automáticamente
- En tests, crear fechas con `DateTime.now()` para mocks

### Estructura de Archivos

```
src/
├── [recurso-plural]/
│   ├── dto/
│   │   ├── create-[recurso-singular].dto.ts
│   │   └── update-[recurso-singular].dto.ts
│   ├── entities/
│   │   └── [recurso-singular].entity.ts
│   ├── [recurso-plural].controller.ts
│   ├── [recurso-plural].service.ts
│   └── [recurso-plural].module.ts

test/
├── [recurso-plural]/
│   ├── [recurso-plural].controller.spec.ts
│   └── [recurso-plural].service.spec.ts
```

### Base de Datos

- Usar SQL Server como motor principal
- Nombres de tablas en `snake_case` y plural
- Nombres de columnas en `snake_case`
- Incluir siempre campos de auditoría (`created_at`, `updated_at`)
- Soft delete mediante campo `is_active`

### Validación y Errores

- Usar `class-validator` para DTOs
- Lanzar excepciones apropiadas de Nest (`NotFoundException`, `BadRequestException`)
- Validaciones de negocio en el service, no en el controller
- Mensajes de error descriptivos

## Ejemplo de Uso del Prompt

```
Crea un recurso CRUD completo para gestionar **Usuarios** con los siguientes campos:
- firstName (string, requerido, máx 50 caracteres)
- lastName (string, requerido, máx 50 caracteres)
- email (string, requerido, único, formato email)
- birthDate (DateTime, opcional)
- phone (string, opcional, máx 20 caracteres)

Sigue todas las especificaciones del prompt de creación de recursos.
```

## Checklist de Verificación

- [ ] Entidad TypeORM creada con DateTime de Luxon
- [ ] Migración generada y aplicada
- [ ] Service con métodos CRUD completos
- [ ] Controller con endpoints REST
- [ ] DTOs con validaciones
- [ ] Módulo configurado e importado en AppModule
- [ ] Tests unitarios para service y controller
- [ ] Estructura de carpetas replicada en test/
- [ ] Compilación sin errores
- [ ] Tests ejecutándose correctamente
