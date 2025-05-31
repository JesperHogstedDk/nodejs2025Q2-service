export class Album implements AlbumInterface {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}


interface AlbumInterface {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}