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
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IdentificationTypesService } from './identification-types.service';
import { IdentificationType } from './entities/identification-type.entity';
import { CreateIdentificationTypeDto } from './dto/create-identification-type.dto';
import { UpdateIdentificationTypeDto } from './dto/update-identification-type.dto';

@Controller('identification-types')
export class IdentificationTypesController {
  constructor(
    private readonly identificationTypesService: IdentificationTypesService,
    @InjectPinoLogger(IdentificationTypesController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createIdentificationTypeDto: CreateIdentificationTypeDto): Promise<IdentificationType> {
    this.logger.info('Creating new identification type', { type: createIdentificationTypeDto.type });
    return this.identificationTypesService.create(createIdentificationTypeDto);
  }

  @Get()
  async findAll(): Promise<IdentificationType[]> {
    this.logger.info('Getting all identification types');
    return this.identificationTypesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<IdentificationType> {
    return this.identificationTypesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIdentificationTypeDto: UpdateIdentificationTypeDto,
  ): Promise<IdentificationType> {
    return this.identificationTypesService.update(id, updateIdentificationTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.identificationTypesService.remove(id);
  }
}
