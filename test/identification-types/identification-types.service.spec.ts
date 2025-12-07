import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { IdentificationTypesService } from '../../src/identification-types/identification-types.service';
import { IdentificationType } from '../../src/identification-types/entities/identification-type.entity';
import { CreateIdentificationTypeDto } from '../../src/identification-types/dto/create-identification-type.dto';
import { UpdateIdentificationTypeDto } from '../../src/identification-types/dto/update-identification-type.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('IdentificationTypesService', () => {
  let service: IdentificationTypesService;
  let repository: MockRepository<IdentificationType>;

  const mockIdentificationType: IdentificationType = {
    id: 1,
    type: 'Cédula de Ciudadanía',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdentificationTypesService,
        {
          provide: getRepositoryToken(IdentificationType),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<IdentificationTypesService>(IdentificationTypesService);
    repository = module.get<MockRepository<IdentificationType>>(
      getRepositoryToken(IdentificationType),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new identification type', async () => {
      const createIdentificationTypeDto: CreateIdentificationTypeDto = {
        type: 'Cédula de Ciudadanía',
      };

      repository.create?.mockReturnValue(mockIdentificationType);
      repository.save?.mockResolvedValue(mockIdentificationType);

      const result = await service.create(createIdentificationTypeDto);

      expect(repository.create).toHaveBeenCalledWith({
        type: 'Cédula de Ciudadanía',
        isActive: true,
      });
      expect(repository.save).toHaveBeenCalledWith(mockIdentificationType);
      expect(result).toEqual(mockIdentificationType);
    });

    it('should create with custom active value', async () => {
      const createIdentificationTypeDto: CreateIdentificationTypeDto = {
        type: 'Pasaporte',
        active: false,
      };

      const inactiveType = { ...mockIdentificationType, type: 'Pasaporte', isActive: false };
      repository.create?.mockReturnValue(inactiveType);
      repository.save?.mockResolvedValue(inactiveType);

      const result = await service.create(createIdentificationTypeDto);

      expect(repository.create).toHaveBeenCalledWith({
        type: 'Pasaporte',
        isActive: false,
      });
      expect(result).toEqual(inactiveType);
    });
  });

  describe('findAll', () => {
    it('should return array of active identification types', async () => {
      repository.find?.mockResolvedValue([mockIdentificationType]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual([mockIdentificationType]);
    });
  });

  describe('findOne', () => {
    it('should return an identification type when found', async () => {
      repository.findOne?.mockResolvedValue(mockIdentificationType);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockIdentificationType);
    });

    it('should throw NotFoundException when identification type not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'IdentificationType con ID 1 no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update and return the identification type', async () => {
      const updateIdentificationTypeDto: UpdateIdentificationTypeDto = {
        type: 'Cédula de Extranjería',
      };

      const updatedType = {
        ...mockIdentificationType,
        type: 'Cédula de Extranjería',
      };

      repository.findOne?.mockResolvedValue(mockIdentificationType);
      repository.save?.mockResolvedValue(updatedType);

      const result = await service.update(1, updateIdentificationTypeDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(mockIdentificationType.type).toBe('Cédula de Extranjería');
      expect(repository.save).toHaveBeenCalledWith(mockIdentificationType);
      expect(result).toEqual(updatedType);
    });

    it('should update active status', async () => {
      const updateIdentificationTypeDto: UpdateIdentificationTypeDto = {
        active: false,
      };

      repository.findOne?.mockResolvedValue(mockIdentificationType);
      repository.save?.mockResolvedValue({ ...mockIdentificationType, isActive: false });

      await service.update(1, updateIdentificationTypeDto);

      expect(mockIdentificationType.isActive).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(mockIdentificationType);
    });

    it('should throw NotFoundException when identification type to update not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      const updateIdentificationTypeDto: UpdateIdentificationTypeDto = {
        type: 'Updated Type',
      };

      await expect(service.update(1, updateIdentificationTypeDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the identification type', async () => {
      const typeToDelete = { ...mockIdentificationType };
      const deletedType = { ...mockIdentificationType, isActive: false };

      repository.findOne?.mockResolvedValue(typeToDelete);
      repository.save?.mockResolvedValue(deletedType);

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(typeToDelete.isActive).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(typeToDelete);
    });

    it('should throw NotFoundException when identification type to delete not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
