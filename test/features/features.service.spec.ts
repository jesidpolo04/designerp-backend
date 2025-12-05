import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { FeaturesService } from '../../src/features/features.service';
import { Feature } from '../../src/features/entities/feature.entity';
import { CreateFeatureDto } from '../../src/features/dto/create-feature.dto';
import { UpdateFeatureDto } from '../../src/features/dto/update-feature.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  })),
});

describe('FeaturesService', () => {
  let service: FeaturesService;
  let repository: MockRepository;

  const mockFeature: Feature = {
    id: 1,
    name: 'Test Feature',
    urlIcono: 'https://example.com/icon.png',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeaturesService,
        {
          provide: getRepositoryToken(Feature),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<FeaturesService>(FeaturesService);
    repository = module.get<MockRepository>(getRepositoryToken(Feature));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new feature', async () => {
      const createFeatureDto: CreateFeatureDto = {
        name: 'Test Feature',
        urlIcono: 'https://example.com/icon.png',
      };

      repository.create?.mockReturnValue(mockFeature);
      repository.save?.mockResolvedValue(mockFeature);

      const result = await service.create(createFeatureDto);

      expect(repository.create).toHaveBeenCalledWith(createFeatureDto);
      expect(repository.save).toHaveBeenCalledWith(mockFeature);
      expect(result).toEqual(mockFeature);
    });
  });

  describe('findAll', () => {
    it('should return array of active features', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockFeature]),
      };

      repository.createQueryBuilder?.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll();

      expect(repository.createQueryBuilder).toHaveBeenCalledWith('feature');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'feature.isActive = :isActive',
        { isActive: true },
      );
      expect(result).toEqual([mockFeature]);
    });

    it('should filter by name when provided', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockFeature]),
      };

      repository.createQueryBuilder?.mockReturnValue(mockQueryBuilder);

      const filters = { name: 'Test' };
      await service.findAll(filters);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'feature.name ILIKE :name',
        { name: '%Test%' },
      );
    });
  });

  describe('findOne', () => {
    it('should return a feature when found', async () => {
      repository.findOne?.mockResolvedValue(mockFeature);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockFeature);
    });

    it('should throw NotFoundException when feature not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'Feature con ID 1 no encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update and return the feature', async () => {
      const updateFeatureDto: UpdateFeatureDto = {
        name: 'Updated Feature',
      };

      const updatedFeature = { ...mockFeature, ...updateFeatureDto };

      repository.findOne?.mockResolvedValue(mockFeature);
      repository.save?.mockResolvedValue(updatedFeature);

      const result = await service.update(1, updateFeatureDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedFeature);
      expect(result).toEqual(updatedFeature);
    });

    it('should throw NotFoundException when feature to update not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      const updateFeatureDto: UpdateFeatureDto = {
        name: 'Updated Feature',
      };

      await expect(service.update(1, updateFeatureDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the feature', async () => {
      const featureToDelete = { ...mockFeature };
      const deletedFeature = { ...mockFeature, isActive: false };

      repository.findOne?.mockResolvedValue(featureToDelete);
      repository.save?.mockResolvedValue(deletedFeature);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(featureToDelete.isActive).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(featureToDelete);
    });

    it('should throw NotFoundException when feature to delete not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
