import { Test, TestingModule } from '@nestjs/testing';
import { DateTime } from 'luxon';
import { GenresController } from '../../src/genres/genres.controller';
import { GenresService } from '../../src/genres/genres.service';
import { TestPinoLoggerModule } from '../pino-test.config';
import { Genre } from '../../src/genres/entities/genre.entity';
import { CreateGenreDto } from '../../src/genres/dto/create-genre.dto';
import { UpdateGenreDto } from '../../src/genres/dto/update-genre.dto';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenre: Genre = {
    id: 1,
    name: 'Rock',
    isActive: true,
    createdAt: DateTime.now(),
    updatedAt: DateTime.now(),
  };

  const mockGenresService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TestPinoLoggerModule],
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new genre', async () => {
      const createGenreDto: CreateGenreDto = {
        name: 'Rock',
        active: true,
      };

      mockGenresService.create.mockResolvedValue(mockGenre);

      const result = await controller.create(createGenreDto);

      expect(service.create).toHaveBeenCalledWith(createGenreDto);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const mockGenres = [mockGenre];
      mockGenresService.findAll.mockResolvedValue(mockGenres);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
    });
  });

  describe('findOne', () => {
    it('should return a single genre', async () => {
      mockGenresService.findOne.mockResolvedValue(mockGenre);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('update', () => {
    it('should update and return the genre', async () => {
      const updateGenreDto: UpdateGenreDto = {
        name: 'Pop',
      };
      const updatedGenre = { ...mockGenre, ...updateGenreDto };

      mockGenresService.update.mockResolvedValue(updatedGenre);

      const result = await controller.update(1, updateGenreDto);

      expect(service.update).toHaveBeenCalledWith(1, updateGenreDto);
      expect(result).toEqual(updatedGenre);
    });
  });

  describe('remove', () => {
    it('should delete the genre', async () => {
      mockGenresService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
