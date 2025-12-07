import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { IdentificationTypesController } from '../../src/identification-types/identification-types.controller';
import { IdentificationTypesService } from '../../src/identification-types/identification-types.service';
import { TestPinoLoggerModule } from '../pino-test.config';
import { IdentificationType } from '../../src/identification-types/entities/identification-type.entity';
import { CreateIdentificationTypeDto } from '../../src/identification-types/dto/create-identification-type.dto';
import { UpdateIdentificationTypeDto } from '../../src/identification-types/dto/update-identification-type.dto';

describe('IdentificationTypesController', () => {
  let controller: IdentificationTypesController;
  let service: IdentificationTypesService;

  const mockIdentificationType: IdentificationType = {
    id: 1,
    type: 'Cédula de Ciudadanía',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockIdentificationTypesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [IdentificationTypesController],
      providers: [
        {
          provide: IdentificationTypesService,
          useValue: mockIdentificationTypesService,
        },
      ],
    }).compile();

    controller = module.get<IdentificationTypesController>(IdentificationTypesController);
    service = module.get<IdentificationTypesService>(IdentificationTypesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new identification type', async () => {
      const createIdentificationTypeDto: CreateIdentificationTypeDto = {
        type: 'Cédula de Ciudadanía',
        active: true,
      };

      mockIdentificationTypesService.create.mockResolvedValue(mockIdentificationType);

      const result = await controller.create(createIdentificationTypeDto);

      expect(service.create).toHaveBeenCalledWith(createIdentificationTypeDto);
      expect(result).toEqual(mockIdentificationType);
    });
  });

  describe('findAll', () => {
    it('should return an array of identification types', async () => {
      const mockTypes = [mockIdentificationType];
      mockIdentificationTypesService.findAll.mockResolvedValue(mockTypes);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTypes);
    });
  });

  describe('findOne', () => {
    it('should return a single identification type', async () => {
      mockIdentificationTypesService.findOne.mockResolvedValue(mockIdentificationType);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockIdentificationType);
    });
  });

  describe('update', () => {
    it('should update and return the identification type', async () => {
      const updateIdentificationTypeDto: UpdateIdentificationTypeDto = {
        type: 'Cédula de Extranjería',
      };
      const updatedType = { ...mockIdentificationType, ...updateIdentificationTypeDto };

      mockIdentificationTypesService.update.mockResolvedValue(updatedType);

      const result = await controller.update(1, updateIdentificationTypeDto);

      expect(service.update).toHaveBeenCalledWith(1, updateIdentificationTypeDto);
      expect(result).toEqual(updatedType);
    });
  });

  describe('remove', () => {
    it('should delete the identification type', async () => {
      mockIdentificationTypesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
