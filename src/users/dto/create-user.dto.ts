import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'jdoe', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  username: string;

  @ApiProperty({ example: 'P@ssw0rd!', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Michael', maxLength: 100, required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  secondName?: string;

  @ApiProperty({ example: 'Doe', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstLastname: string;

  @ApiProperty({ example: 'Smith', maxLength: 100, required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  secondLastname?: string;

  @ApiProperty({ example: 'john.doe@example.com', maxLength: 255 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 1, description: 'Role ID' })
  @IsInt()
  roleId: number;

  @ApiProperty({ example: 1, description: 'Genre ID' })
  @IsInt()
  genreId: number;

  @ApiProperty({ example: 1, required: false, description: 'Department ID' })
  @IsInt()
  @IsOptional()
  departmentId?: number;

  @ApiProperty({ example: true, required: false, default: true })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
