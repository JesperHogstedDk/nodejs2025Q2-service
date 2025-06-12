import { Artist } from 'src/artist/entities/artist.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FavoriteArtist {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => Artist, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  public favorite: Artist;
}
