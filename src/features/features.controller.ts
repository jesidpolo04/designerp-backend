import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { FeaturesService } from './features.service';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import type { FeatureFilters } from './dto/feature.filters';

@Controller('features')
export class FeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
    @InjectPinoLogger(FeaturesController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFeatureDto: CreateFeatureDto): Promise<Feature> {
    this.logger.info('Creating new feature', { name: createFeatureDto.name });
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  async findAll(@Query() filters?: FeatureFilters): Promise<Feature[]> {
    this.logger.info('Getting all features', { filters });
    return this.featuresService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Feature> {
    return this.featuresService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<Feature> {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.featuresService.remove(id);
  }
}
