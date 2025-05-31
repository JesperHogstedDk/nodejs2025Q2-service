import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { albums, artists, favs, tracks } from '../db';

@Injectable()
export class FavsService {
  findAll() {
    return {
      artists: favs.artists.map(id => artists.get(id)).filter(Boolean),
      albums: favs.albums.map(id => albums.get(id)).filter(Boolean),
      tracks: favs.tracks.map(id => tracks.get(id)).filter(Boolean),
    };
  }

  async addTrack(id: string) {
    const track = tracks.get(id);
    if (!track) throw new UnprocessableEntityException('Track does not exist');
    if (!favs.tracks.includes(id)) favs.tracks.push(id);
  }

  async removeTrack(id: string) {
    if (!favs.tracks.includes(id)) throw new NotFoundException('Track is not favorite');
    favs.tracks = favs.tracks.filter(trackId => trackId !== id);
  }

  async addAlbum(id: string) {
    const album = albums.get(id);
    if (!album) throw new UnprocessableEntityException('Album does not exist');
    if (!favs.albums.includes(id)) favs.albums.push(id);
  }

  async removeAlbum(id: string) {
    if (!favs.albums.includes(id)) throw new NotFoundException('Album is not favorite');
    favs.albums = favs.albums.filter(albumId => albumId !== id);
  }

  async addArtist(id: string) {
    const artist = artists.get(id);
    if (!artist) throw new UnprocessableEntityException('Artist does not exist');
    if (!favs.artists.includes(id)) favs.artists.push(id);
  }

  async removeArtist(id: string) {
    if (!favs.artists.includes(id)) throw new NotFoundException('Artist is not favorite');
    favs.artists = favs.artists.filter(artistId => artistId !== id);
  }
}