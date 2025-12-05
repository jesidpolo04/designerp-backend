import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';

interface CreateRolInput {
  name: string;
  description?: string;
}

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async create(data: CreateRolInput): Promise<Rol> {
    const rol = this.rolRepository.create({
      name: data.name,
      description: data.description,
    });
    return this.rolRepository.save(rol);
  }

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }
}
