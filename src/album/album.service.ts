import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { Repository } from 'typeorm';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ArtistService } from 'src/artist/artist.service';

@Injectable()
export class AlbumService {
    constructor(
      @InjectRepository(Album)
      private readonly albumRepository: Repository<Album>,
      private readonly artistService: ArtistService,      
    ) { }

  async create(createAlbumDto: CreateAlbumDto) {
    console.log('This action adds a new album');
    const artistExists = await this.artistService.findOne(createAlbumDto.artistId);

    const album = new Album();
    album.id = randomUUID();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = artistExists ? createAlbumDto.artistId : null;
    return await this.albumRepository.save(album);
  }

  async findAll() {
    console.log('This action returns all album');
    return await this.albumRepository.find();     
  }

  async findOne(id: string) {
    console.log(`This action returns a #${id} album`);
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      return null;
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    console.log(`This action updates a #${id} album`);
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      // throw new Error('Album not found');
      return null; 
    }
    Object.assign(album, updateAlbumDto);
    return await this.albumRepository.save(album);
  }
  async remove(id: string) {
    console.log(`This action removes a #${id} album`);
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) {
      // throw new Error('Album not found');
      return false;
    }
    const removedAlbum = await this.albumRepository.delete(id);
    if (removedAlbum.affected > 0) {
      return true;
    } else {
      return false
    }
  }
}
