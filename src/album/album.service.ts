import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { randomUUID } from 'node:crypto';
import { albums, artists, tracks } from 'src/db';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto) {
    console.log('This action adds a new album');
    const artist = artists.has(createAlbumDto.artistId);

    const album = new Album();
    album.id = randomUUID();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = artist ? createAlbumDto.artistId : null;
    albums.set(album.id, album);
    return album;
  }

  findAll() {
    console.log('This action returns all album');
    const allAlbums = Array.from(albums.values()).map((album) => {
      const { id, name, year, artistId } = album;
      return { id, name, year, artistId };
    });
    return allAlbums;
  }

  findOne(id: string) {
    console.log(`This action returns a #${id} album`);
    if (albums.has(id)) {
      const album = albums.get(id);
      return album;
    }
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    console.log(`This action updates a #${id} album`);
    if (albums.has(id)) {
      const album = albums.get(id);
      const albumUpdated = { ...album, ...updateAlbumDto };
      albums.set(id, albumUpdated);
      return albumUpdated;
    }
  }

  remove(id: string) {
    console.log(`This action removes a #${id} album`);
    if (albums.has(id)) {
      const album = albums.get(id);
      const albumDeleted = albums.delete(id);
      if (albumDeleted) {
        Array.from(tracks.values()).map((track) => {
          if (track.albumId && track.albumId === album.id) {
            track.albumId = null;
          }
          tracks.set(track.id, track);
        });
        return true;
      }
    }
    return false;
  }
}
