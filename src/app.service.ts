import { Injectable } from '@nestjs/common';
import { Public } from './auth/auth.decorator';

@Public()
@Injectable()
export class AppService {
  welcome(): string {
    console.log('Welcome');
    return '<h1>Home Library Service</h1><p>This service is part of the Home Library project. It provides a REST API for managing users, artists, albums, tracks, and favorites.</p> <p>For more information, visit <a href="http://localhost:4000/doc">http://localhost:4000/doc</a></p>';
  }
}
