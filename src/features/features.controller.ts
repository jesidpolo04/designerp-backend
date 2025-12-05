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
import { FeaturesService } from './features.service';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFeatureDto: CreateFeatureDto): Promise<Feature> {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  async findAll(@Query() filters?: any): Promise<Feature[]> {
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
