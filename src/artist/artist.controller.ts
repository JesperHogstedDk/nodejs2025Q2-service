import {
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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || !createArtistDto.grammy) {
      throw new ForbiddenException('Name and Grammy are required fields');
    }
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const artist = await this.artistService.findOne(id);
    if (artist) {
      return artist;
    }
    throw new NotFoundException(`Artist with id ${id} not found`);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    if (!updateArtistDto.name && !updateArtistDto.grammy) {
      throw new ForbiddenException(
        'At least one of name or grammy must be provided',
      );
    }
    const artist = await this.artistService.update(id, updateArtistDto);
    if (artist) {
      return;
    }
    throw new NotFoundException(`Artist with id ${id} not found`);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    const foundAndDeleted = await this.artistService.remove(id);
    if (foundAndDeleted) {
      return;
    }
    throw new NotFoundException(`Artist with id ${id} not found`);
  }
}
