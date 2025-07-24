import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as yamljs from 'yamljs';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LogService } from './log/log.service';
import { RequestResponseLoggerInterceptor } from './log/request-response-logger.interceptor';

dotenv.config();
if (!process.env.PORT) {
  console.error(
    'Environment variable "PORT" is missing. Please define it in your .env file. Exiting...',
  );
  process.exit(1);
}
const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = await app.resolve(LogService);
  logger.setContext('home-library-service');
  app.useLogger(logger);

  app.useGlobalInterceptors(new RequestResponseLoggerInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalPipes(new ValidationPipe());

  const document: OpenAPIObject = yamljs.load('doc/api.yaml');
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    logger.logException(error, 'UncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.logException(reason, 'UnhandledRejection');
    logger.debug(`Promise type: ${promise?.constructor?.name ?? 'Unknown'}`);
  });

  await app.listen(PORT ?? 4000);
}
bootstrap();
