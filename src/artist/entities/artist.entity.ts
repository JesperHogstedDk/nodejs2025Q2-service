export class Artist implements ArtistInterface {
  id: string;
  name: string;
  grammy: boolean;
}

interface ArtistInterface {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}
