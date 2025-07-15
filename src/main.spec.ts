import { LogService } from '../src/log/log.service';
import * as process from 'process';

describe('Global exception handlers', () => {
  let originalExceptionHandler: NodeJS.UncaughtExceptionListener;
  let originalRejectionHandler: NodeJS.UnhandledRejectionListener;
  let mockLogService: LogService;

  beforeEach(() => {
    mockLogService = {
      logException: jest.fn(),
      setContext: jest.fn(),
    } as unknown as LogService;

    // Gem eksisterende handlers hvis de findes
    originalExceptionHandler = process.listeners('uncaughtException')[0];
    originalRejectionHandler = process.listeners('unhandledRejection')[0];

    // Fjern eksisterende handlers
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    // Registrér test-handlers
    process.on('uncaughtException', (error: Error) => {
      mockLogService.logException(error, 'UncaughtException');
    });

    process.on('unhandledRejection', (reason: any, _promise: Promise<any>) => {
      mockLogService.logException(reason, 'UnhandledRejection');
    });
  });

  afterEach(() => {
    // Restore original handlers
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    if (originalExceptionHandler) {
      process.on('uncaughtException', originalExceptionHandler);
    }
    if (originalRejectionHandler) {
      process.on('unhandledRejection', originalRejectionHandler);
    }
  });

  it('should handle uncaughtException', () => {
    const error = new Error('Test uncaughtException');
    process.emit('uncaughtException', error);
    expect(mockLogService.logException).toHaveBeenCalledWith(
      error,
      'UncaughtException',
    );
  });

  it('should handle unhandledRejection', () => {
    const reason = new Error('Test unhandledRejection');
    process.emit('unhandledRejection', reason, Promise.resolve());
    expect(mockLogService.logException).toHaveBeenCalledWith(
      reason,
      'UnhandledRejection',
    );
  });
});
