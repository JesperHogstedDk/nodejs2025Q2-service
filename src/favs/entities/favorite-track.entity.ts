import { Track } from 'src/track/entities/track.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FavoriteTrack' })
export class FavoriteTrack {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => Track, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  public favorite: Track;
}
