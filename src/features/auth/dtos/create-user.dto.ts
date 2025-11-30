import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsString()
  @MaxLength(40)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  secondName?: string;

  @IsString()
  @MaxLength(50)
  firstLastname: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  secondLastname?: string;

  @IsString()
  @MaxLength(50)
  username: string;

  @IsEmail({}, { message: "El correo no es válido" })
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(255)
  password: string;

  @IsInt()
  genreId: number;

  @IsInt()
  rolId: number;
}
