import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureFilters } from './dto/feature.filters';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<Feature> {
    const feature = this.featureRepository.create(createFeatureDto);
    return this.featureRepository.save(feature);
  }

  async findAll(filters?: FeatureFilters): Promise<Feature[]> {
    const queryBuilder = this.featureRepository.createQueryBuilder('feature');

    // Solo mostrar activos por defecto
    queryBuilder.where('feature.isActive = :isActive', { isActive: true });

    if (filters?.name) {
      queryBuilder.andWhere('feature.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Feature> {
    const feature = await this.featureRepository.findOne({
      where: { id, isActive: true },
    });

    if (!feature) {
      throw new NotFoundException(`Feature con ID ${id} no encontrada`);
    }

    return feature;
  }

  async update(
    id: number,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    const feature = await this.findOne(id);

    Object.assign(feature, updateFeatureDto);
    return this.featureRepository.save(feature);
  }

  async remove(id: number): Promise<void> {
    const feature = await this.findOne(id);

    // Soft delete
    feature.isActive = false;
    await this.featureRepository.save(feature);
  }
}
