import { ConsoleLogger, Injectable, Scope, LoggerService, LogLevel } from '@nestjs/common';


@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger  {

  constructor() {
    super();    
    const levels = process.env.LOG_LEVEL?.split(',') ?? ['log', 'error', 'warn'];
    super.setLogLevels(levels as any);
  }

  log(message: string) {
    super.log(this.format('LOG', message, 'green'));
  }

  warn(message: string) {
    super.warn(this.format('WARN', message, 'yellow'));
  }

  error(message: string, trace?: string) {
    super.error(this.format('ERROR', message, 'red') + (trace ? `\n${trace}` : ''));
  }

  debug(message: string) {
    super.debug(this.format('DEBUG', message, 'blue'));
  }

  verbose(message: string) {
    super.verbose(this.format('VERBOSE', message, 'magenta'));
  }

  private format(level: string, message: string, color: 'red' | 'green' | 'yellow' | 'blue' | 'magenta'): string {
    const colors: Record<string, string> = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      reset: '\x1b[0m',
    };
    return `${colors.reset} ${message}`;
    const timestamp = new Date().toISOString();
    return `${colors[color]}[${level}]${colors.reset} ${timestamp} ${message}`;
  }
}