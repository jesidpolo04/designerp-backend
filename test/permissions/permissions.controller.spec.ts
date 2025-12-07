import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { PermissionsController } from '../../src/permissions/permissions.controller';
import { PermissionsService } from '../../src/permissions/permissions.service';
import { TestPinoLoggerModule } from '../pino-test.config';
import { Permission, PermissionType } from '../../src/permissions/entities/permission.entity';
import { Feature } from '../../src/features/entities/feature.entity';
import { CreatePermissionDto } from '../../src/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '../../src/permissions/dto/update-permission.dto';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockFeature: Feature = {
    id: 1,
    name: 'User Management',
    urlIcono: 'https://example.com/icon.png',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockPermission: Permission = {
    id: 1,
    permissionType: PermissionType.READ,
    feature: mockFeature,
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockPermissionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        permissionType: PermissionType.READ,
        featureId: 1,
        active: true,
      };

      mockPermissionsService.create.mockResolvedValue(mockPermission);

      const result = await controller.create(createPermissionDto);

      expect(service.create).toHaveBeenCalledWith(createPermissionDto);
      expect(result).toEqual(mockPermission);
    });
  });

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const mockPermissions = [mockPermission];
      mockPermissionsService.findAll.mockResolvedValue(mockPermissions);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockPermissions);
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      mockPermissionsService.findOne.mockResolvedValue(mockPermission);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPermission);
    });
  });

  describe('update', () => {
    it('should update and return the permission', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        permissionType: PermissionType.WRITE,
      };
      const updatedPermission = {
        ...mockPermission,
        permissionType: PermissionType.WRITE,
      };

      mockPermissionsService.update.mockResolvedValue(updatedPermission);

      const result = await controller.update(1, updatePermissionDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePermissionDto);
      expect(result).toEqual(updatedPermission);
    });
  });

  describe('remove', () => {
    it('should delete the permission', async () => {
      mockPermissionsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
