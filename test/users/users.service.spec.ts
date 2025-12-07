import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../src/users/users.service';
import { User } from '../../src/users/entities/user.entity';
import { Rol } from '../../src/roles/entities/rol.entity';
import { Genre } from '../../src/genres/entities/genre.entity';
import { Department } from '../../src/departments/entities/department.entity';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../../src/users/dto/update-user.dto';

jest.mock('bcrypt');

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;
  let roleRepository: MockRepository<Rol>;
  let genreRepository: MockRepository<Genre>;
  let departmentRepository: MockRepository<Department>;

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

  beforeEach(async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        { provide: getRepositoryToken(Rol), useValue: createMockRepository() },
        { provide: getRepositoryToken(Genre), useValue: createMockRepository() },
        {
          provide: getRepositoryToken(Department),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    roleRepository = module.get<MockRepository<Rol>>(getRepositoryToken(Rol));
    genreRepository = module.get<MockRepository<Genre>>(getRepositoryToken(Genre));
    departmentRepository = module.get<MockRepository<Department>>(
      getRepositoryToken(Department),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
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

      roleRepository.findOne?.mockResolvedValue(mockRole);
      genreRepository.findOne?.mockResolvedValue(mockGenre);
      departmentRepository.findOne?.mockResolvedValue(mockDepartment);

      userRepository.create?.mockReturnValue(mockUser);
      userRepository.save?.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(departmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('P@ssw0rd!', 'salt');
      expect(userRepository.create).toHaveBeenCalledWith({
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
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if role not found', async () => {
      roleRepository.findOne?.mockResolvedValue(null);

      const createUserDto: CreateUserDto = {
        username: 'jdoe',
        password: 'P@ssw0rd!',
        firstName: 'John',
        firstLastname: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
        genreId: 1,
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if genre not found', async () => {
      roleRepository.findOne?.mockResolvedValue(mockRole);
      genreRepository.findOne?.mockResolvedValue(null);

      const createUserDto: CreateUserDto = {
        username: 'jdoe',
        password: 'P@ssw0rd!',
        firstName: 'John',
        firstLastname: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
        genreId: 1,
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if department not found when provided', async () => {
      roleRepository.findOne?.mockResolvedValue(mockRole);
      genreRepository.findOne?.mockResolvedValue(mockGenre);
      departmentRepository.findOne?.mockResolvedValue(null);

      const createUserDto: CreateUserDto = {
        username: 'jdoe',
        password: 'P@ssw0rd!',
        firstName: 'John',
        firstLastname: 'Doe',
        email: 'john.doe@example.com',
        roleId: 1,
        genreId: 1,
        departmentId: 1,
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return array of active users', async () => {
      userRepository.find?.mockResolvedValue([mockUser]);

      // mock implementation of repository.find to respect where condition
      userRepository.find = jest
        .fn()
        .mockResolvedValueOnce([mockUser]);

      const result = await service.findAll();

      expect(userRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      userRepository.findOne?.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'User con ID 1 no encontrado',
      );
    });
  });

  describe('update', () => {
    it('should update user basic fields', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'jdoe-updated',
        active: false,
      };

      const updatedUser: User = {
        ...mockUser,
        username: 'jdoe-updated',
        isActive: false,
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      userRepository.save?.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(userRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });

    it('should rehash password if provided', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'NewP@ssw0rd!',
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      userRepository.save?.mockResolvedValue(mockUser);

      await service.update(1, updateUserDto);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalled();
    });

    it('should update role, genre and department when ids provided', async () => {
      const updateUserDto: UpdateUserDto = {
        roleId: 1,
        genreId: 1,
        departmentId: 1,
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      roleRepository.findOne?.mockResolvedValue(mockRole);
      genreRepository.findOne?.mockResolvedValue(mockGenre);
      departmentRepository.findOne?.mockResolvedValue(mockDepartment);
      userRepository.save?.mockResolvedValue(mockUser);

      await service.update(1, updateUserDto);

      expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(genreRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(departmentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if role to update not found', async () => {
      const updateUserDto: UpdateUserDto = {
        roleId: 1,
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      roleRepository.findOne?.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if genre to update not found', async () => {
      const updateUserDto: UpdateUserDto = {
        genreId: 1,
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      genreRepository.findOne?.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if department to update not found', async () => {
      const updateUserDto: UpdateUserDto = {
        departmentId: 1,
      };

      userRepository.findOne?.mockResolvedValue(mockUser);
      departmentRepository.findOne?.mockResolvedValue(null);

      await expect(service.update(1, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the user', async () => {
      const userToDelete = { ...mockUser };
      const deletedUser = { ...mockUser, isActive: false };

      userRepository.findOne?.mockResolvedValue(userToDelete);
      userRepository.save?.mockResolvedValue(deletedUser);

      await service.remove(1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(userToDelete.isActive).toBe(false);
      expect(userRepository.save).toHaveBeenCalledWith(userToDelete);
    });

    it('should throw NotFoundException when user to delete not found', async () => {
      userRepository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
