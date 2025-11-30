import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: "El nombre es muy corto" })
  name: string;

  @IsEmail({}, { message: "El correo no es válido" })
  email: string;
}
