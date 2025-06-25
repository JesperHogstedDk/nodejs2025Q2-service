import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) { }

  async create(createTrackDto: CreateTrackDto) {
    console.log('This action adds a new track');
    const artistExists = await this.artistService.findOne(
      createTrackDto.artistId,
    );
    const albumExists = await this.albumService.findOne(createTrackDto.albumId);

    const track = new Track();
    track.id = randomUUID();
    track.name = createTrackDto.name;
    track.duration = createTrackDto.duration;
    track.albumId = albumExists ? createTrackDto.albumId : null;
    track.artistId = artistExists ? createTrackDto.artistId : null;
    return await this.trackRepository.save(track);

    // return track;
  }

  async findAll() {
    console.log(`This action returns all tracks`);
    return await this.trackRepository.find();
    // return allTracks;
  }

  async findOne(id: string) {
    console.log(`This action returns a #${id} track`);
    return await this.trackRepository.findOneBy({ id });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    console.log(`This action updates a #${id} track`);
    const track = await this.trackRepository.findOneBy({ id });
    if (track) {
      const trackUpdated = { ...track, ...updateTrackDto };
      return await this.trackRepository.save(trackUpdated);
      // return trackUpdated;
    }
  }

  async remove(id: string) {
    console.log(`This action removes a #${id} track`);
    const track = await this.trackRepository.findOneBy({ id });
    if (track) {
      await this.trackRepository.remove(track);
      return true;
    }
    return false;
  }
}
