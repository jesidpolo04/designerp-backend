import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentificationTypesService } from './identification-types.service';
import { IdentificationTypesController } from './identification-types.controller';
import { IdentificationType } from './entities/identification-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdentificationType])],
  controllers: [IdentificationTypesController],
  providers: [IdentificationTypesService],
  exports: [IdentificationTypesService],
})
export class IdentificationTypesModule {}
