import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Rol } from './roles/entities/rol.entity';
import { RolesModule } from './roles/roles.module';
import { Feature } from './features/entities/feature.entity';
import { FeaturesModule } from './features/features.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './shared/guards/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 1433),
      username: process.env.DB_USERNAME ?? 'sa',
      password: process.env.DB_PASSWORD ?? 'TuPasswordFuerte123!',
      database: process.env.DB_NAME ?? 'corona-rebates',
      entities: [Rol, Feature],
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      options: {
        trustServerCertificate: true,
      },
    }),
    RolesModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
  exports: [PassportModule],
})
export class AppModule {}
