import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { DepartmentsService } from '../../src/departments/departments.service';
import { Department } from '../../src/departments/entities/department.entity';
import { CreateDepartmentDto } from '../../src/departments/dto/create-department.dto';
import { UpdateDepartmentDto } from '../../src/departments/dto/update-department.dto';

type MockRepository<T extends ObjectLiteral = Department> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <
  T extends ObjectLiteral = Department,
>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let repository: MockRepository;

  const mockDepartment: Department = {
    id: 1,
    name: 'Diseño',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getRepositoryToken(Department),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
    repository = module.get<MockRepository>(getRepositoryToken(Department));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Diseño',
        active: true,
      };

      repository.create?.mockReturnValue(mockDepartment);
      repository.save?.mockResolvedValue(mockDepartment);

      const result = await service.create(createDepartmentDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDepartmentDto,
        isActive: createDepartmentDto.active,
      });
      expect(repository.save).toHaveBeenCalledWith(mockDepartment);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('findAll', () => {
    it('should return array of active departments', async () => {
      repository.find?.mockResolvedValue([mockDepartment]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(result).toEqual([mockDepartment]);
    });
  });

  describe('findOne', () => {
    it('should return a department when found', async () => {
      repository.findOne?.mockResolvedValue(mockDepartment);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockDepartment);
    });

    it('should throw NotFoundException when department not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'Department con ID 1 no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update and return the department', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Contabilidad',
      };

      const updatedDepartment = { ...mockDepartment, ...updateDepartmentDto };

      repository.findOne?.mockResolvedValue(mockDepartment);
      repository.save?.mockResolvedValue(updatedDepartment);

      const result = await service.update(1, updateDepartmentDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedDepartment);
      expect(result).toEqual(updatedDepartment);
    });

    it('should throw NotFoundException when department to update not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Contabilidad',
      };

      await expect(service.update(1, updateDepartmentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the department', async () => {
      const departmentToDelete = { ...mockDepartment };

      repository.findOne?.mockResolvedValue(departmentToDelete);
      repository.save?.mockResolvedValue({
        ...departmentToDelete,
        isActive: false,
      });

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(departmentToDelete.isActive).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(departmentToDelete);
    });

    it('should throw NotFoundException when department to delete not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
