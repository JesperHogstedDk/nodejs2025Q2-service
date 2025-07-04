import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AlbumModule } from './album/album.module';
import { Album } from './album/entities/album.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { Artist } from './artist/entities/artist.entity';
import { AuthModule } from './auth/auth.module';
import { FavsModule } from './favs/favs.module';
import { JsonLogService } from './log/json.log.service';
import { LogService } from './log/log.service';
import { Track } from './track/entities/track.entity';
import { TrackModule } from './track/track.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';

dotenv.config();

console.log(
  'AppModule loading.',
  'host port:', process.env.PORT,
  'db host:',
  process.env.DB_HOST,
  'db port:',
  parseInt(process.env.DB_PORT || '5432', 10),
);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: (process.env.DB_HOST || 'db').trim(),
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      // entities: [`/**/*.entity.js`],
      // migrations: [`/database/migrations/*.js`],
      // migrationsRun: true,
    }),
    TypeOrmModule.forFeature([User, Artist, Album, Track]),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
    AuthModule,
    JwtModule,
    LogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
