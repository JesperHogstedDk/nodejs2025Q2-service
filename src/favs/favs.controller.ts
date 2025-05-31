import { Controller, Get, Post, Delete, Param, HttpCode, ParseUUIDPipe, Res } from '@nestjs/common';
import { FavsService } from './favs.service';
import { Response } from 'express';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.addTrack(id);
      return res.status(201).json({ message: 'Track added to favorites' });
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.removeTrack(id);
      return res.send();
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }

  @Post('album/:id')
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.addAlbum(id);
      return res.status(201).json({ message: 'Album added to favorites' });
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.removeAlbum(id);
      return res.send();
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }

  @Post('artist/:id')
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.addArtist(id);
      return res.status(201).json({ message: 'Artist added to favorites' });
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string, @Res() res: Response) {
    try {
      await this.favsService.removeArtist(id);
      return res.send();
    } catch (e) {
      return res.status(e.status || 500).json({ message: e.message });
    }
  }
}