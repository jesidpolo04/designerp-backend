import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Rol } from '../roles/entities/rol.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Department } from '../departments/entities/department.entity';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rol)
    private readonly roleRepository: Repository<Rol>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  private async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const [role, genre, department] = await Promise.all([
      this.roleRepository.findOne({ where: { id: createUserDto.roleId } }),
      this.genreRepository.findOne({ where: { id: createUserDto.genreId } }),
      createUserDto.departmentId
        ? this.departmentRepository.findOne({
            where: { id: createUserDto.departmentId },
          })
        : Promise.resolve(null),
    ]);

    if (!role) {
      throw new NotFoundException(
        `Rol con ID ${createUserDto.roleId} no encontrado`,
      );
    }

    if (!genre) {
      throw new NotFoundException(
        `Genre con ID ${createUserDto.genreId} no encontrado`,
      );
    }

    if (createUserDto.departmentId && !department) {
      throw new NotFoundException(
        `Department con ID ${createUserDto.departmentId} no encontrado`,
      );
    }

    const passwordHash = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      username: createUserDto.username,
      passwordHash,
      role,
      genre,
      department: department ?? null,
      isActive: createUserDto.active ?? true,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new NotFoundException(`User con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username !== undefined) {
      user.username = updateUserDto.username;
    }

    if (updateUserDto.password) {
      user.passwordHash = await this.hashPassword(updateUserDto.password);
    }

    if (updateUserDto.roleId !== undefined) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });
      if (!role) {
        throw new NotFoundException(
          `Rol con ID ${updateUserDto.roleId} no encontrado`,
        );
      }
      user.role = role;
    }

    if (updateUserDto.genreId !== undefined) {
      const genre = await this.genreRepository.findOne({
        where: { id: updateUserDto.genreId },
      });
      if (!genre) {
        throw new NotFoundException(
          `Genre con ID ${updateUserDto.genreId} no encontrado`,
        );
      }
      user.genre = genre;
    }

    if (updateUserDto.departmentId !== undefined) {
      if (updateUserDto.departmentId === null) {
        user.department = null;
      } else {
        const department = await this.departmentRepository.findOne({
          where: { id: updateUserDto.departmentId },
        });
        if (!department) {
          throw new NotFoundException(
            `Department con ID ${updateUserDto.departmentId} no encontrado`,
          );
        }
        user.department = department;
      }
    }

    if (updateUserDto.active !== undefined) {
      user.isActive = updateUserDto.active;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }
}
