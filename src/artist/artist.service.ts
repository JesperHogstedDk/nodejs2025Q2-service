import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { albums, artists, tracks } from 'src/db';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'node:crypto';

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
      return artist;
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    console.log(`This action updates a #${id} artist`);
    if (artists.has(id)) {
      const artist = artists.get(id);
      const updatedArtist = { ...artist, ...updateArtistDto };
      artists.set(id, updatedArtist);
      return updatedArtist;
    }
  }

  remove(id: string) {
    console.log(`This action removes a #${id} artist`);
    if (artists.has(id)) {
      const artist = artists.get(id);
      const artistDeleted = artists.delete(id);
      if (artistDeleted) {
        const tracksWithArtists = Array.from(tracks.values()).map((track) => {
          if (track.artistId && track.artistId === artist.id) {
            track.artistId = null;
          }
          tracks.set(track.id, track);
        });
        const tracksWithAlbums = Array.from(albums.values()).map((album) => {
          if (album.artistId && album.artistId === artist.id) {
            album.artistId = null;
          }
          albums.set(album.id, album);
        });

        return true;
      }
    }
    return false;
  }
}
