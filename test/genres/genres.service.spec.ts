import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DateTime } from 'luxon';
import { GenresService } from '../../src/genres/genres.service';
import { Genre } from '../../src/genres/entities/genre.entity';
import { CreateGenreDto } from '../../src/genres/dto/create-genre.dto';
import { UpdateGenreDto } from '../../src/genres/dto/update-genre.dto';

type MockRepository<T extends ObjectLiteral = Genre> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepository = <T extends ObjectLiteral = Genre>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('GenresService', () => {
  let service: GenresService;
  let repository: MockRepository;

  const mockGenre: Genre = {
    id: 1,
    name: 'Rock',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getRepositoryToken(Genre),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
    repository = module.get<MockRepository>(getRepositoryToken(Genre));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new genre', async () => {
      const createGenreDto: CreateGenreDto = {
        name: 'Rock',
        active: true,
      };

      repository.create?.mockReturnValue(mockGenre);
      repository.save?.mockResolvedValue(mockGenre);

      const result = await service.create(createGenreDto);

      expect(repository.create).toHaveBeenCalledWith({
        ...createGenreDto,
        isActive: createGenreDto.active,
      });
      expect(repository.save).toHaveBeenCalledWith(mockGenre);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('findAll', () => {
    it('should return array of active genres', async () => {
      repository.find?.mockResolvedValue([mockGenre]);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(result).toEqual([mockGenre]);
    });
  });

  describe('findOne', () => {
    it('should return a genre when found', async () => {
      repository.findOne?.mockResolvedValue(mockGenre);

      const result = await service.findOne(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(result).toEqual(mockGenre);
    });

    it('should throw NotFoundException when genre not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow(
        'Genre con ID 1 no encontrada',
      );
    });
  });

  describe('update', () => {
    it('should update and return the genre', async () => {
      const updateGenreDto: UpdateGenreDto = {
        name: 'Pop',
      };

      const updatedGenre = { ...mockGenre, ...updateGenreDto };

      repository.findOne?.mockResolvedValue(mockGenre);
      repository.save?.mockResolvedValue(updatedGenre);

      const result = await service.update(1, updateGenreDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(repository.save).toHaveBeenCalledWith(updatedGenre);
      expect(result).toEqual(updatedGenre);
    });

    it('should throw NotFoundException when genre to update not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      const updateGenreDto: UpdateGenreDto = {
        name: 'Pop',
      };

      await expect(service.update(1, updateGenreDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete the genre', async () => {
      const genreToDelete = { ...mockGenre };

      repository.findOne?.mockResolvedValue(genreToDelete);
      repository.save?.mockResolvedValue({ ...genreToDelete, isActive: false });

      await service.remove(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1, isActive: true },
      });
      expect(genreToDelete.isActive).toBe(false);
      expect(repository.save).toHaveBeenCalledWith(genreToDelete);
    });

    it('should throw NotFoundException when genre to delete not found', async () => {
      repository.findOne?.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
