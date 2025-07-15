import { ConsoleLogger, Injectable, Scope, LogLevel } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import * as util from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  constructor(private readonly fileService: FileService) {
    super();
    const levels = process.env.LOG_LEVEL?.split(',') ?? [
      'verbose',
      'debug',
      'log',
      'warn',
      'error',
      'fatal',
    ];
    this.setLogLevels(levels as LogLevel[]);
    console.log('LogService env log level(s): ', levels);
  }

  log(message: unknown, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.fileService.log(this.formatForFile('LOG', message));
  }

  warn(message: unknown) {
    super.warn(message);
    this.fileService.log(this.formatForFile('WARN', message));
  }

  error(message: unknown, stack?: string, context?: string) {
    const stackOrContext =
      (stack ? `\n${stack}` : '') + (context ? `\n${context}` : '');
    // super.error(message, stack, context);
    // super.error(message, stackOrContext);
    // super.error(message, stack);
    if (stack && context) {
      super.error(message, stack, context);
    } else if (stack) {
      super.error(message, stack);
    } else {
      super.error(message);
    }

    this.fileService.log(this.formatForFile('ERROR', message + stackOrContext));
  }

  debug(message: unknown, context?: string) {
    super.debug(message, context);
    super.debug(message);
    this.fileService.log(this.formatForFile('DEBUG', message));
  }

  verbose(message: unknown) {
    super.verbose(message);
    this.fileService.log(this.formatForFile('VERBOSE', message));
  }

  logException(error: unknown, context?: string) {
    const resolvedContext = context ?? this.context; // ?? 'ExceptionHandler';

    if (error instanceof Error) {
      const message = `${error.name}: ${error.message}`;
      const fullError = util.inspect(error, { depth: null });
      // super.error(message, error.stack, resolvedContext);
      this.error(message, error.stack, resolvedContext);
      // super.debug(`Full error:\n${fullError}`, resolvedContext);
      this.debug(`Full error: ${fullError}`, resolvedContext);
    } else {
      const fallback =
        typeof error === 'object'
          ? JSON.stringify(error, null, 2)
          : String(error);
      super.error('Non-Error exception thrown', undefined, resolvedContext);
      super.debug(`Thrown value:\n${fallback}`, resolvedContext);
    }
  }

  private formatForFile(level: string, message: unknown): string | null {
    const parsed =
      typeof message === 'object'
        ? util.inspect(message, { depth: null })
        : String(message);

    return `${this.getTimestamp()} [${level}] [${this.context}] ${parsed} `;
  }
}
