import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'node:crypto';
import { albums, artists, tracks } from 'src/db';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto) {
    console.log("This action adds a new track");
    const artistExists = artists.has(createTrackDto.artistId);
    const albumExists = albums.has(createTrackDto.albumId);

    const track = new Track();
    track.id = randomUUID();
    track.name = createTrackDto.name;
    track.duration = createTrackDto.duration;
    track.albumId = albumExists ? createTrackDto.albumId : null;
    track.artistId = artistExists ? createTrackDto.artistId : null;
    tracks.set(track.id, track);

    return track;
  }

  findAll() {
    console.log(`This action returns all tracks`);
    const allTracks = Array.from(tracks.values()).map(track => {
      const { id, name, duration, albumId, artistId } = track;
      return { id, name, duration, albumId, artistId };
    });
    return allTracks;
  }

  findOne(id: string) {
    console.log(`This action returns a #${id} track`);
    if (tracks.has(id)) {
      const track = tracks.get(id);
      return track;
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    console.log(`This action updates a #${id} track`);
    if (tracks.has(id)) {
      const track = tracks.get(id);
      const trackUpdated = { ...track, ...updateTrackDto };
      tracks.set(id, trackUpdated);
      return trackUpdated;
    }
  }

  remove(id: string) {
    console.log(`This action removes a #${id} track`);
    if (tracks.has(id)) {
      return tracks.delete(id);
    }
  }
}
