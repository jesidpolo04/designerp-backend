import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { FeaturesController } from '../../src/features/features.controller';
import { FeaturesService } from '../../src/features/features.service';
import { TestPinoLoggerModule } from '../pino-test.config';
import { Feature } from '../../src/features/entities/feature.entity';
import { CreateFeatureDto } from '../../src/features/dto/create-feature.dto';
import { UpdateFeatureDto } from '../../src/features/dto/update-feature.dto';

describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;

  const mockFeature: Feature = {
    id: 1,
    name: 'Test Feature',
    urlIcono: 'https://example.com/icon.png',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockFeaturesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [FeaturesController],
      providers: [
        {
          provide: FeaturesService,
          useValue: mockFeaturesService,
        },
      ],
    }).compile();

    controller = module.get<FeaturesController>(FeaturesController);
    service = module.get<FeaturesService>(FeaturesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new feature', async () => {
      const createFeatureDto: CreateFeatureDto = {
        name: 'Test Feature',
        urlIcono: 'https://example.com/icon.png',
      };

      mockFeaturesService.create.mockResolvedValue(mockFeature);

      const result = await controller.create(createFeatureDto);

      expect(service.create).toHaveBeenCalledWith(createFeatureDto);
      expect(result).toEqual(mockFeature);
    });
  });

  describe('findAll', () => {
    it('should return an array of features', async () => {
      const mockFeatures = [mockFeature];
      mockFeaturesService.findAll.mockResolvedValue(mockFeatures);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockFeatures);
    });

    it('should return features with filters', async () => {
      const mockFeatures = [mockFeature];
      const filters = { name: 'Test' };
      mockFeaturesService.findAll.mockResolvedValue(mockFeatures);

      const result = await controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockFeatures);
    });
  });

  describe('findOne', () => {
    it('should return a single feature', async () => {
      mockFeaturesService.findOne.mockResolvedValue(mockFeature);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFeature);
    });
  });

  describe('update', () => {
    it('should update and return the feature', async () => {
      const updateFeatureDto: UpdateFeatureDto = {
        name: 'Updated Feature',
      };
      const updatedFeature = { ...mockFeature, ...updateFeatureDto };

      mockFeaturesService.update.mockResolvedValue(updatedFeature);

      const result = await controller.update(1, updateFeatureDto);

      expect(service.update).toHaveBeenCalledWith(1, updateFeatureDto);
      expect(result).toEqual(updatedFeature);
    });
  });

  describe('remove', () => {
    it('should delete the feature', async () => {
      mockFeaturesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
