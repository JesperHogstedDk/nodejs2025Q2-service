import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'node:crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) { }


  async create(createArtistDto: CreateArtistDto) {
    const artist = new Artist();
    artist.id = randomUUID();
    artist.name = createArtistDto.name;
    artist.grammy = createArtistDto.grammy;

    return await this.artistRepository.save(artist);
  }

  async findAll() {
    console.log('`This action returns all artist`');
    return await this.artistRepository.find();
  }

  async findOne(id: string) {
    console.log(`This action returns a #${id} artist`);
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      return null;
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    console.log(`This action updates a #${id} artist`);
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      // throw new Error('Artist not found');
      return null;
    }
    Object.assign(artist, updateArtistDto);
    return await this.artistRepository.save(artist);
  }


  async remove(id: string) {
    console.log(`This action removes a #${id} artist`);
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) {
      // throw new Error('Artist not found');
      return false;
    }
    const removedArtist = await this.artistRepository.delete(id);
    if (removedArtist.affected > 0) {
      return true;
    } else {
      return false;
    }
  }
}