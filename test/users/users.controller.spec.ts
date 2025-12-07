import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';
import { TestPinoLoggerModule } from '../pino-test.config';
import { User } from '../../src/users/entities/user.entity';
import { Rol } from '../../src/roles/entities/rol.entity';
import { Genre } from '../../src/genres/entities/genre.entity';
import { Department } from '../../src/departments/entities/department.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockRole: Rol = {
    id: 1,
    name: 'Admin',
    description: 'Admin role',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockGenre: Genre = {
    id: 1,
    name: 'Masculino',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockDepartment: Department = {
    id: 1,
    name: 'IT',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockUser: User = {
    id: 1,
    username: 'jdoe',
    passwordHash: 'hashed-password',
    firstName: 'John',
    secondName: 'Michael',
    firstLastname: 'Doe',
    secondLastname: 'Smith',
    email: 'john.doe@example.com',
    role: mockRole,
    genre: mockGenre,
    department: mockDepartment,
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'jdoe',
        password: 'P@ssw0rd!',
        firstName: 'John',
        secondName: 'Michael',
        firstLastname: 'Doe',
        secondLastname: 'Smith',
        email: 'john.doe@example.com',
        roleId: 1,
        genreId: 1,
        departmentId: 1,
        active: true,
      };

      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockUser];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'jdoe-updated',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(1, updateUserDto);

      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete the user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
