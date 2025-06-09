import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { TrackModule } from 'src/track/track.module';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Album]),
  forwardRef(() => TrackModule),
  forwardRef(() => ArtistModule)    
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule { }
