import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { validate } from 'uuid';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      throw new BadRequestException('Name and year are required fields');
    }

    if (
      !createAlbumDto.artistId &&
      createAlbumDto.artistId !== null &&
      !validate(createAlbumDto.artistId)
    ) {
      throw new BadRequestException('artistId should be a UUID or null');
    }

    const album = this.albumService.create(createAlbumDto);
    if (album) {
      return album;
    }
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const album = this.albumService.findOne(id);
    if (album) {
      return album;
    }
    throw new NotFoundException(`Album with id ${id} not found`);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    if (!updateAlbumDto.name && !updateAlbumDto.year) {
      throw new ForbiddenException(
        'At least one of name and year are required',
      );
    }
    const album = this.albumService.update(id, updateAlbumDto);
    if (album) {
      return;
    }
    throw new NotFoundException(`Album with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const foundAndDeleted = this.albumService.remove(id);
    if (foundAndDeleted) {
      return;
    }
    throw new NotFoundException(`Album with id ${id} not found`);
  }
}
