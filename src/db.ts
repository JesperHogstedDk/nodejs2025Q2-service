import { Album } from './album/entities/album.entity';
import { Artist } from './artist/entities/artist.entity';
import { User } from './user/entities/user.entity';

export const users: Map<string, User> = new Map();

export const artists: Map<string, Artist> = new Map();

export const albums: Map<string, Album> = new Map(); 
