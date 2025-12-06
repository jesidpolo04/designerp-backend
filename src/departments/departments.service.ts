import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create({
      ...createDepartmentDto,
      isActive: createDepartmentDto.active ?? true,
    });
    return this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id, isActive: true },
    });

    if (!department) {
      throw new NotFoundException(`Department con ID ${id} no encontrado`);
    }

    return department;
  }

  async update(
    id: number,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(id);

    Object.assign(department, {
      ...updateDepartmentDto,
      isActive:
        typeof updateDepartmentDto.active === 'boolean'
          ? updateDepartmentDto.active
          : department.isActive,
    });

    return this.departmentRepository.save(department);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);

    department.isActive = false;
    await this.departmentRepository.save(department);
  }
}
