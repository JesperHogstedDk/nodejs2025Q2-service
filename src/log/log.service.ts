import { ConsoleLogger, Injectable, Scope, LogLevel } from '@nestjs/common';
import * as util from 'util';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService extends ConsoleLogger {
  constructor() {
    super();
    const levels = process.env.LOG_LEVEL?.split(',') ?? [
      'log',
      'error',
      'warn',
      'debug',
      'verbose',
    ];
    this.setLogLevels(levels as LogLevel[]);
  }

  log(message: unknown) {
    const formatted = this.format('LOG', message, 'green');
    super.log(formatted);
  }

  warn(message: unknown, context?: string) {
    const formatted = this.format('WARN', message, 'yellow');
    if (!formatted) return;
    super.warn(formatted, context);
  }

  error(message: unknown, trace?: string) {
    const formatted = this.format('ERROR', message, 'red');
    if (!formatted) return;
    super.error(formatted + (trace ? `\n${trace}` : ''));
  }

  debug(message: unknown) {
    const formatted = this.format('DEBUG', message, 'blue');
    if (!formatted) return;
    super.debug(formatted);
  }

  verbose(message: unknown) {
    const formatted = this.format('VERBOSE', message, 'magenta');
    if (!formatted) return;
    super.verbose(formatted);
  }

  logException(error: unknown, context?: string) {
    const resolvedContext = context ?? 'ExceptionHandler';

    if (error instanceof Error) {
      const message = `${error.name}: ${error.message}`;
      const fullError = util.inspect(error, { depth: null });
      super.error(message, error.stack, resolvedContext);
      super.debug(`Full error:\n${fullError}`, resolvedContext);
    } else {
      const fallback =
        typeof error === 'object'
          ? JSON.stringify(error, null, 2)
          : String(error);
      super.error('Non-Error exception thrown', undefined, resolvedContext);
      super.debug(`Thrown value:\n${fallback}`, resolvedContext);
    }
  }

  private format(
    level: string,
    message: unknown,
    color: 'red' | 'green' | 'yellow' | 'blue' | 'magenta',
  ): string | null {
    const colors: Record<string, string> = {
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      reset: '\x1b[0m',
    };

    if (!this.hasContent(message)) return null;

    const parsed =
      typeof message === 'object'
        ? util.inspect(message, { depth: null })
        : String(message);

    return `${colors[color]}[${level}]${colors.reset} ${parsed}`;
  }

  private hasContent(value: unknown): boolean {
    return !(value === undefined || value === null || value === '');
  }
}
