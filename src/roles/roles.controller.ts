import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Rol } from './entities/rol.entity';

interface CreateRolDto {
  name: string;
  description?: string;
}

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateRolDto): Promise<Rol> {
    return this.rolesService.create(body);
  }

  @Get()
  async findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }
}
