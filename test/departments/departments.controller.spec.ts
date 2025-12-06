import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { DepartmentsController } from '../../src/departments/departments.controller';
import { DepartmentsService } from '../../src/departments/departments.service';
import { Department } from '../../src/departments/entities/department.entity';
import { CreateDepartmentDto } from '../../src/departments/dto/create-department.dto';
import { UpdateDepartmentDto } from '../../src/departments/dto/update-department.dto';
import { TestPinoLoggerModule } from '../pino-test.config';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockDepartment: Department = {
    id: 1,
    name: 'Diseño',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockDepartmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [DepartmentsController],
      providers: [
        {
          provide: DepartmentsService,
          useValue: mockDepartmentsService,
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Diseño',
        active: true,
      };

      mockDepartmentsService.create.mockResolvedValue(mockDepartment);

      const result = await controller.create(createDepartmentDto);

      expect(service.create).toHaveBeenCalledWith(createDepartmentDto);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const mockDepartments = [mockDepartment];
      mockDepartmentsService.findAll.mockResolvedValue(mockDepartments);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockDepartments);
    });
  });

  describe('findOne', () => {
    it('should return a single department', async () => {
      mockDepartmentsService.findOne.mockResolvedValue(mockDepartment);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockDepartment);
    });
  });

  describe('update', () => {
    it('should update and return the department', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = {
        name: 'Contabilidad',
      };
      const updatedDepartment = { ...mockDepartment, ...updateDepartmentDto };

      mockDepartmentsService.update.mockResolvedValue(updatedDepartment);

      const result = await controller.update(1, updateDepartmentDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDepartmentDto);
      expect(result).toEqual(updatedDepartment);
    });
  });

  describe('remove', () => {
    it('should delete the department', async () => {
      mockDepartmentsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
