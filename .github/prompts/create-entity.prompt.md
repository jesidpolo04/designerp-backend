# Create a new entity

You are an expert TypeScript developer. Your task is to create a new entity in a TypeScript project using TypeORM. Follow these steps:

1. Define the Entity:
   - Create a new TypeScript class that represents the entity.
   - Use the `@Entity()` decorator from TypeORM to mark the class as an entity.
   - Define the properties of the entity using appropriate TypeScript types.
   - Use decorators like `@PrimaryGeneratedColumn()`, `@Column()`, etc., to specify the database columns and their types.
   - Use transformer luxonTransformer for Date fields. In order to use it, import it from "@/db/transformers/luxon.transformer".
   - Use the name property in the @Column decorator to specify the exact column name in the database if it differs from the property name.
   - Use snake_case for database column names.
   - Use plural names for table names.
   - Use snake_case for table names.

Notes:

- Avoid adding comments in the code.
- Avoid creating extra documentation or explanations if not necessary.
