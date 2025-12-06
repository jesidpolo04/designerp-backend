import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const genre = this.genreRepository.create({
      ...createGenreDto,
      isActive: createGenreDto.active ?? true,
    });
    return this.genreRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return this.genreRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id, isActive: true },
    });

    if (!genre) {
      throw new NotFoundException(`Genre con ID ${id} no encontrada`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.findOne(id);

    Object.assign(genre, {
      ...updateGenreDto,
      isActive:
        typeof updateGenreDto.active === 'boolean'
          ? updateGenreDto.active
          : genre.isActive,
    });

    return this.genreRepository.save(genre);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.findOne(id);

    genre.isActive = false;
    await this.genreRepository.save(genre);
  }
}
