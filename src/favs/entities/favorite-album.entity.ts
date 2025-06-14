import { Album } from '../../album/entities/album.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FavoriteAlbum' })
export class FavoriteAlbum {
  @PrimaryGeneratedColumn()
  public id: number;

  @OneToOne(() => Album, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  public favorite: Album;
}
