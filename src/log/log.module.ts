import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { FileService } from 'src/file/file.service';

@Global()
@Module({
  providers: [LogService, FileService],
  exports: [LogService],
})
export class LogModule {}
