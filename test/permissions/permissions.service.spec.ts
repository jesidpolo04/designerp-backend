import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PermissionsService } from '../../src/permissions/permissions.service';
import { Permission, PermissionType } from '../../src/permissions/entities/permission.entity';
import { Feature } from '../../src/features/entities/feature.entity';
import { CreatePermissionDto } from '../../src/permissions/dto/create-permission.dto';
import { UpdatePermissionDto } from '../../src/permissions/dto/update-permission.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('PermissionsService', () => {
  let service: PermissionsService;
  let permissionRepository: MockRepository<Permission>;
  let featureRepository: MockRepository<Feature>;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getRepositoryToken(Permission),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Feature),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    permissionRepository = module.get<MockRepository<Permission>>(
      getRepositoryToken(Permission),
    );
    featureRepository = module.get<MockRepository<Feature>>(
      getRepositoryToken(Feature),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        permissionType: PermissionType.READ,
        featureId: 1,
      };

      featureRepository.findOne?.mockResolvedValue(mockFeature);
      permissionRepository.create?.mockReturnValue(mockPermission);
      permissionRepository.save?.mockResolvedValue(mockPermission);

      const result = await service.create(createPermissionDto);

      expect(featureRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(permissionRepository.create).toHaveBeenCalledWith({
        permissionType: PermissionType.READ,
        feature: mockFeature,
        isActive: true,
      });
      expect(permissionRepository.save).toHaveBeenCalledWith(mockPermission);
      expect(result).toEqual(mockPermission);
    });

    it('should create with custom active value', async () => {
      const createPermissionDto: CreatePermissionDto = {
        permissionType: PermissionType.WRITE,
        featureId: 1,
        active: false,
      };

      const inactivePermission = { ...mockPermission, isActive: false };
      featureRepository.findOne?.mockResolvedValue(mockFeature);
      permissionRepository.create?.mockReturnValue(inactivePermission);
      permissionRepository.save?.mockResolvedValue(inactivePermission);

      const result = await service.create(createPermissionDto);

      expect(permissionRepository.create).toHaveBeenCalledWith({
        permissionType: PermissionType.WRITE,
        feature: mockFeature,
        isActive: false,
      });
      expect(result).toEqual(inactivePermission);
    });

    it('should throw NotFoundException if feature not found', async () => {
      const createPermissionDto: CreatePermissionDto = {
        permissionType: PermissionType.READ,
        featureId: 999,
      };

      featureRepository.findOne?.mockResolvedValue(null);

      await expect(service.create(createPermissionDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createPermissionDto)).rejects.toThrow(
        'Feature con ID 999 no encontrado',
      );
    });
  });

  describe('findAll', () => {
    it('should return array of active permissions', async () => {
      permissionRepository.find?.mockResolvedValue([mockPermission]);

      const result = await service.findAll();

      expect(permissionRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual([mockPermission]);
    });
  });

  describe('findOne', () => {
    it('should return a permission when found', async () => {
      permissionRepository.findOne?.mockResolvedValue(mockPermission);

      const result = await service.findOne(1);

      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockPermission);
    });

    it('should throw NotFoundException when permission not found', async () => {
      permissionRepository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'Permission con ID 1 no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update permission type', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        permissionType: PermissionType.MANAGE,
      };

      const updatedPermission = {
        ...mockPermission,
        permissionType: PermissionType.MANAGE,
      };

      permissionRepository.findOne?.mockResolvedValue(mockPermission);
      permissionRepository.save?.mockResolvedValue(updatedPermission);

      const result = await service.update(1, updatePermissionDto);

      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(mockPermission.permissionType).toBe(PermissionType.MANAGE);
      expect(permissionRepository.save).toHaveBeenCalledWith(mockPermission);
      expect(result).toEqual(updatedPermission);
    });

    it('should update feature', async () => {
      const newFeature: Feature = {
        id: 2,
        name: 'Product Management',
        urlIcono: 'https://example.com/icon2.png',
        isActive: true,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      };

      const updatePermissionDto: UpdatePermissionDto = {
        featureId: 2,
      };

      permissionRepository.findOne?.mockResolvedValue(mockPermission);
      featureRepository.findOne?.mockResolvedValue(newFeature);
      permissionRepository.save?.mockResolvedValue({
        ...mockPermission,
        feature: newFeature,
      });

      await service.update(1, updatePermissionDto);

      expect(featureRepository.findOne).toHaveBeenCalledWith({
        where: { id: 2 },
      });
      expect(mockPermission.feature).toBe(newFeature);
      expect(permissionRepository.save).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw NotFoundException if feature to update not found', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        featureId: 999,
      };

      permissionRepository.findOne?.mockResolvedValue(mockPermission);
      featureRepository.findOne?.mockResolvedValue(null);

      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        'Feature con ID 999 no encontrado',
      );
    });

    it('should update active status', async () => {
      const updatePermissionDto: UpdatePermissionDto = {
        active: false,
      };

      permissionRepository.findOne?.mockResolvedValue(mockPermission);
      permissionRepository.save?.mockResolvedValue({
        ...mockPermission,
        isActive: false,
      });

      await service.update(1, updatePermissionDto);

      expect(mockPermission.isActive).toBe(false);
      expect(permissionRepository.save).toHaveBeenCalledWith(mockPermission);
    });

    it('should throw NotFoundException when permission to update not found', async () => {
      permissionRepository.findOne?.mockResolvedValue(null);

      const updatePermissionDto: UpdatePermissionDto = {
        permissionType: PermissionType.DELETE,
      };

      await expect(service.update(1, updatePermissionDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the permission', async () => {
      const permissionToDelete = { ...mockPermission };
      const deletedPermission = { ...mockPermission, isActive: false };

      permissionRepository.findOne?.mockResolvedValue(permissionToDelete);
      permissionRepository.save?.mockResolvedValue(deletedPermission);

      await service.remove(1);

      expect(permissionRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(permissionToDelete.isActive).toBe(false);
      expect(permissionRepository.save).toHaveBeenCalledWith(
        permissionToDelete,
      );
    });

    it('should throw NotFoundException when permission to delete not found', async () => {
      permissionRepository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
