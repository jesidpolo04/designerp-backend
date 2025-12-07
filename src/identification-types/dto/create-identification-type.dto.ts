import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateIdentificationTypeDto {
  @ApiProperty({ example: 'Cédula de Ciudadanía', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  type: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
