import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteArtist } from './entities/favorite-artist.entity';
import { FavoriteAlbum } from './entities/favorite-album.entity';
import { FavoriteTrack } from './entities/favorite-track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(FavoriteArtist)
    private favoriteArtistRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private favoriteAlbumRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private favoriteTrackRepository: Repository<FavoriteTrack>,
  ) {}

  async findAll() {
    console.log('`This action returns all favorites`');
    const promises = [
      this.favoriteArtistRepository,
      this.favoriteAlbumRepository,
      this.favoriteTrackRepository,
    ].map((repo) => repo.find({ relations: { favorite: true } }));
    return await Promise.all(promises).then(([artists, albums, tracks]) => {
      return {
        artists: artists.map((fav) => fav.favorite),
        albums: albums.map((fav) => fav.favorite),
        tracks: tracks.map((fav) => fav.favorite),
      };
    });
  }

  async addTrack(id: string) {
    return this.favoriteTrackRepository
      .save({
        favorite: { id },
      } as FavoriteTrack)
      .catch((err) => {
        if (err.code === '23505') {
          throw new UnprocessableEntityException('Track already exists');
        }
        if (err.code === '23503') {
          throw new UnprocessableEntityException('Track does not exist');
        }
        throw err;
      });
  }

  async removeTrack(id: string) {
    return this.favoriteTrackRepository
      .delete({ favorite: { id } })
      .catch((err) => {
        if (err.code === '23503') {
          throw new NotFoundException('Track is not favorite');
        }
        throw err;
      });
  }

  async addAlbum(id: string) {
    return this.favoriteAlbumRepository
      .save({
        favorite: { id },
      } as FavoriteAlbum)
      .catch((err) => {
        if (err.code === '23505') {
          throw new UnprocessableEntityException('Album already exists');
        }
        if (err.code === '23503') {
          throw new UnprocessableEntityException('Album does not exist');
        }
        throw err;
      });
  }

  async removeAlbum(id: string) {
    return this.favoriteAlbumRepository
      .delete({ favorite: { id } })
      .catch((err) => {
        if (err.code === '23503') {
          throw new NotFoundException('Album is not favorite');
        }
        throw err;
      });
  }

  async addArtist(id: string) {
    return this.favoriteArtistRepository
      .save({
        favorite: { id },
      } as FavoriteArtist)
      .catch((err) => {
        if (err.code === '23505') {
          throw new UnprocessableEntityException('Artist already exists');
        }
        if (err.code === '23503') {
          throw new UnprocessableEntityException('Artist does not exist');
        }
        throw err;
      });
  }

  async removeArtist(id: string) {
    return this.favoriteArtistRepository
      .delete({ favorite: { id } })
      .catch((err) => {
        if (err.code === '23503') {
          throw new NotFoundException('Artist is not favorite');
        }
        throw err;
      });
  }
}
