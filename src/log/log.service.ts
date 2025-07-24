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

  private fileMessage(message: unknown, level: LogLevel) {
    if (this.isLevelEnabled(level)) {
      this.fileService.writeToFile(this.formatForFile(level.toUpperCase(), message));
    }
  }

  private formatForFile(level: string, message: unknown): string | null {
    const parsed =
      typeof message === 'object'
        ? util.inspect(message, { depth: null })
        : String(message);

    return `${this.getTimestamp()} [${level}] [${this.context}] ${parsed} `;
  }

  log(message: unknown, ...optionalParams: any[]) {
    super.log(message, ...optionalParams);
    this.fileMessage(message, 'log');
  }

  warn(message: unknown) {
    super.warn(message);
    this.fileMessage(message, 'warn');
  }

  error(message: unknown, stack?: string, context?: string) {
    if (stack && context) {
      super.error(message, stack, context);
    } else if (stack) {
      super.error(message, stack);
    } else {
      super.error(message);
    }
    const stackOrContext =
      (stack ? `\n${stack}` : '') + (context ? `\n${context}` : '');

    this.fileMessage(message + stackOrContext, 'error');
  }

  debug(message: unknown, context?: string) {
    if (context) {
      super.debug(message, context);
    } else {
      super.debug(message);
    }
    this.fileMessage(message, 'debug');
  }

  verbose(message: unknown) {
    super.verbose(message);
    // this.fileService.writeToFile(this.formatForFile('VERBOSE', message));
    this.fileMessage(message, 'verbose');
  }

  fatal(message: unknown, context?: string) {
    super.fatal(message);
    this.fileMessage(message, 'fatal');
  }

  logException(error: unknown, context?: string) {
    const resolvedContext = context ?? this.context; // ?? 'ExceptionHandler';

    if (error instanceof Error) {
      const message = `${error.name}: ${error.message}`;
      const fullError = util.inspect(error, { depth: null });
      // super.error(message, error.stack, resolvedContext);
      this.error(message, error.stack, resolvedContext);
      // super.debug(`Full error:\n${fullError}`, resolvedContext);
      if (this.isLevelEnabled('debug')) {
        this.debug(`Full error: ${fullError}`, resolvedContext);
      }
    } else {
      const fallback =
        typeof error === 'object'
          ? JSON.stringify(error, null, 2)
          : String(error);
      super.error('Non-Error exception thrown', undefined, resolvedContext);
      if (this.isLevelEnabled('debug')) {
        super.debug(`Thrown value:\n${fallback}`, resolvedContext);
      }
    }
  }
}
