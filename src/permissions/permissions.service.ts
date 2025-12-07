import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Feature } from '../features/entities/feature.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const feature = await this.featureRepository.findOne({
      where: { id: createPermissionDto.featureId },
    });

    if (!feature) {
      throw new NotFoundException(
        `Feature con ID ${createPermissionDto.featureId} no encontrado`,
      );
    }

    const permission = this.permissionRepository.create({
      permissionType: createPermissionDto.permissionType,
      feature,
      isActive: createPermissionDto.active ?? true,
    });

    return this.permissionRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id, isActive: true },
    });

    if (!permission) {
      throw new NotFoundException(`Permission con ID ${id} no encontrado`);
    }

    return permission;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (updatePermissionDto.permissionType !== undefined) {
      permission.permissionType = updatePermissionDto.permissionType;
    }

    if (updatePermissionDto.featureId !== undefined) {
      const feature = await this.featureRepository.findOne({
        where: { id: updatePermissionDto.featureId },
      });

      if (!feature) {
        throw new NotFoundException(
          `Feature con ID ${updatePermissionDto.featureId} no encontrado`,
        );
      }

      permission.feature = feature;
    }

    if (updatePermissionDto.active !== undefined) {
      permission.isActive = updatePermissionDto.active;
    }

    return this.permissionRepository.save(permission);
  }

  async remove(id: number): Promise<void> {
    const permission = await this.findOne(id);
    permission.isActive = false;
    await this.permissionRepository.save(permission);
  }
}
