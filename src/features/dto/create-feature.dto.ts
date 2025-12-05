import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  name!: string;

  @IsOptional()
  @IsUrl({}, { message: 'urlIcono debe ser una URL válida' })
  @MaxLength(500)
  @ApiProperty()
  urlIcono?: string;
}
