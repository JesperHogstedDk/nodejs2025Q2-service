import { Injectable, LoggerService } from '@nestjs/common';

export const MY_LOGGER = 'MY_LOGGER';


@Injectable()
export class JsonLogService implements LoggerService {
  log(message: any) {
    console.log(JSON.stringify({ level: 'log', timestamp: new Date().toISOString(), message }));
  }

  error(message: any, trace?: string) {
    console.error(JSON.stringify({ level: 'error', timestamp: new Date().toISOString(), message, trace }));
  }

  warn(message: any) {
    console.warn(JSON.stringify({ level: 'warn', timestamp: new Date().toISOString(), message }));
  }

  debug?(message: any) {
    console.debug(JSON.stringify({ level: 'debug', timestamp: new Date().toISOString(), message }));
  }

  verbose?(message: any) {
    console.info(JSON.stringify({ level: 'verbose', timestamp: new Date().toISOString(), message }));
  }
  
}

  // private format(level: string, message: any, trace?: string): string {
  //   const log = {
  //     level,
  //     timestamp: new Date().toISOString(),
  //     context: this.context,
  //     message,
  //     ...(trace ? { trace } : {}),
  //   };
  //   return JSON.stringify(log);
  // }
