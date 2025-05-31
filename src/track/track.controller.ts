import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  ParseUUIDPipe,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || !createTrackDto.duration) {
      throw new BadRequestException('Name and duration are mandatory fields');
    }
    if (createTrackDto.albumId && !validate(createTrackDto.albumId)) {
      throw new BadRequestException('AlbumId should be a UUID or null');
    }
    if (createTrackDto.artistId && !validate(createTrackDto.artistId)) {
      throw new BadRequestException('ArtistId should be a UUDI or null');
    }

    const track = this.trackService.create(createTrackDto);
    if (track) {
      return track;
    }
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const track = this.trackService.findOne(id);
    if (track) {
      return track;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const track = this.trackService.update(id, updateTrackDto);
    if (track) {
      return track;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const isDeleted = this.trackService.remove(id);
    if (isDeleted) {
      return;
    }
    throw new NotFoundException(`Track with id ${id} not found`);
  }
}
