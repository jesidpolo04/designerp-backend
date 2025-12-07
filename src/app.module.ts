import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Rol } from './roles/entities/rol.entity';
import { RolesModule } from './roles/roles.module';
import { Feature } from './features/entities/feature.entity';
import { FeaturesModule } from './features/features.module';
import { Genre } from './genres/entities/genre.entity';
import { GenresModule } from './genres/genres.module';
import { Department } from './departments/entities/department.entity';
import { DepartmentsModule } from './departments/departments.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { IdentificationType } from './identification-types/entities/identification-type.entity';
import { IdentificationTypesModule } from './identification-types/identification-types.module';
import { Permission } from './permissions/entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './shared/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { pinoConfig } from './config/pino.config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot(pinoConfig),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'erika-trujillo',
      entities: [Rol, Feature, Genre, Department, User, IdentificationType, Permission],
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      retryAttempts: 3,
    }),
    RolesModule,
    FeaturesModule,
    GenresModule,
    DepartmentsModule,
    UsersModule,
    IdentificationTypesModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [PassportModule],
})
export class AppModule {}
