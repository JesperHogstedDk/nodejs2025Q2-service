import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { validate } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are mandatory fields');
    }
    if (createTrackDto.albumId && !validate(createTrackDto.albumId)) {
      throw new BadRequestException('AlbumId should be a UUID or null');
    }
    if (createTrackDto.artistId && !validate(createTrackDto.artistId)) {
      throw new BadRequestException('ArtistId should be a UUDI or null');
    }

    const track = await this.trackService.create(createTrackDto);
    if (track) {
      return track;
    }
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = await this.trackService.findOne(id);
    if (track) {
      return track;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const track = await this.trackService.update(id, updateTrackDto);
    if (track) {
      return track;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const isDeleted = await this.trackService.remove(id);
    if (isDeleted) {
      return;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }
}
