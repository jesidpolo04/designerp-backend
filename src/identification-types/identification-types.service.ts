import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentificationType } from './entities/identification-type.entity';
import { CreateIdentificationTypeDto } from './dto/create-identification-type.dto';
import { UpdateIdentificationTypeDto } from './dto/update-identification-type.dto';

@Injectable()
export class IdentificationTypesService {
  constructor(
    @InjectRepository(IdentificationType)
    private readonly identificationTypeRepository: Repository<IdentificationType>,
  ) {}

  async create(createIdentificationTypeDto: CreateIdentificationTypeDto): Promise<IdentificationType> {
    const identificationType = this.identificationTypeRepository.create({
      type: createIdentificationTypeDto.type,
      isActive: createIdentificationTypeDto.active ?? true,
    });
    return this.identificationTypeRepository.save(identificationType);
  }

  async findAll(): Promise<IdentificationType[]> {
    return this.identificationTypeRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<IdentificationType> {
    const identificationType = await this.identificationTypeRepository.findOne({
      where: { id, isActive: true },
    });

    if (!identificationType) {
      throw new NotFoundException(`IdentificationType con ID ${id} no encontrado`);
    }

    return identificationType;
  }

  async update(
    id: number,
    updateIdentificationTypeDto: UpdateIdentificationTypeDto,
  ): Promise<IdentificationType> {
    const identificationType = await this.findOne(id);

    if (updateIdentificationTypeDto.type !== undefined) {
      identificationType.type = updateIdentificationTypeDto.type;
    }

    if (updateIdentificationTypeDto.active !== undefined) {
      identificationType.isActive = updateIdentificationTypeDto.active;
    }

    return this.identificationTypeRepository.save(identificationType);
  }

  async remove(id: number): Promise<void> {
    const identificationType = await this.findOne(id);
    identificationType.isActive = false;
    await this.identificationTypeRepository.save(identificationType);
  }
}
