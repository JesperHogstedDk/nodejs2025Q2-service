import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogService } from './log.service';

@Injectable()
export class RequestResponseLoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, query, body } = req;

    const startTime = Date.now();

    this.logger.log(`[REQUEST] ${method} ${url}`);
    this.logger.debug(`Query: ${JSON.stringify(query)}`);
    this.logger.debug(`Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const duration = Date.now() - startTime;
        this.logger.log(
          `[RESPONSE] ${method} ${url} - Status: ${res.statusCode} - Duration: ${duration}ms`,
        );
      }),
    );
  }
}
