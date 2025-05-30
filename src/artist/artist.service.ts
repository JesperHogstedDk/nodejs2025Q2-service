import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { artists } from 'src/db';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto) {
    const artist = new Artist();
    artist.id = randomUUID();
    artist.name = createArtistDto.name;
    artist.grammy = createArtistDto.grammy;
    artists.set(artist.id, artist);
    return artist;
  }

  findAll() {
    console.log('`This action returns all artist`');
    const allArtists = Array.from(artists.values()).map((artist) => {
      const { id, name, grammy } = artist;
      return { id, name, grammy };
    });
    return allArtists;
  }

  findOne(id: string) {
    console.log(`This action returns a #${id} artist`);
    if (artists.has(id)) {
      const artist = artists.get(id);
      const { name, grammy } = artist;
      return { id, name, grammy };
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    console.log(`This action updates a #${id} artist`);
    if (artists.has(id)) {
      const artist = artists.get(id);
      const { name, grammy } = artist;
      const updatedArtist = { ...artist, ...updateArtistDto };
      artists.set(id, updatedArtist);
      return updatedArtist;
    }
  }

  remove(id: string) {
    console.log(`This action removes a #${id} artist`);
    if (artists.has(id)) {
      artists.delete(id);
      return true;
    }
    return false;
  }
}
