import { Album } from './album/entities/album.entity';
import { Artist } from './artist/entities/artist.entity';
import { Track } from './track/entities/track.entity';
import { User } from './user/entities/user.entity';

export const users: Map<string, User> = new Map();

export const artists: Map<string, Artist> = new Map();

export const albums: Map<string, Album> = new Map(); 

export const tracks: Map<string, Track> = new Map();