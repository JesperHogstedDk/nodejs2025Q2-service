import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLogService extends ConsoleLogger {

    private logStream = fs.createWriteStream(path.join(__dirname, '../logs/combined.log'), { flags: 'a' });
    private errorStream = fs.createWriteStream(path.join(__dirname, '../logs/error.log'), { flags: 'a' });

    constructor(context?: string) {
        super(context);
        const levels = process.env.LOG_LEVELS?.split(',') ?? ['log', 'warn', 'error'];
        this.setLogLevels(levels as any);
        const logsDir = path.join(__dirname, '../logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

    }

    log(message: string) {
        const formatted = this.format('LOG', message, 'green');
        super.log(formatted);
        this.logStream.write(formatted + '\n');
    }

    warn(message: string) {
        const formatted = this.format('WARN', message, 'yellow');
        super.warn(formatted);
        this.logStream.write(formatted + '\n');
    }

    error(message: string, trace?: string) {
        const formatted = this.format('ERROR', message, 'red') + (trace ? `\n${trace}` : '');
        super.error(formatted);
        this.logStream.write(formatted + '\n');
        this.errorStream.write(formatted + '\n');
    }

    debug(message: string) {
        const formatted = this.format('DEBUG', message, 'blue');
        super.debug(formatted);
        this.logStream.write(formatted + '\n');
    }

    verbose(message: string) {
        const formatted = this.format('VERBOSE', message, 'magenta');
        super.verbose(formatted);
        this.logStream.write(formatted + '\n');
    }

    private format(level: string, message: string, color: keyof typeof this.colors): string {
        const timestamp = new Date().toISOString();
        const contextLabel = this.context ? `[${this.context}]` : '';
        return `${this.colors[color]}[${level}]${this.colors.reset} ${timestamp} ${contextLabel} ${message}`;
    }

    private readonly colors: Record<string, string> = {
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        reset: '\x1b[0m',
    };
}