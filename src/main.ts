import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as yamljs from 'yamljs';
import { AppModule } from './app.module';
import { LogService } from './log/log.service';
import { JsonLogService } from './log/json.log.service';
import { FileLogService } from './log/file.log.service';

dotenv.config();
if (!process.env.PORT) {
  console.error(
    'Environment variable "PORT" is missing. Please define it in your .env file. Exiting...',
  );
  process.exit(1);
}
const PORT = process.env.PORT;

async function bootstrap() {

  Logger.log("Log Test")
  Logger.warn("Log warn")
  Logger.error("Log error")

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    // logger: console
    // logger: new LogService("home-library-service"),
    // logger: new JsonLogService(),
    // logger: new FileLogService("home-library-service"),
  });
  app.useLogger(new LogService("home-library-service"));
  
  app.useGlobalPipes(new ValidationPipe());

  const document: OpenAPIObject = yamljs.load('doc/api.yaml');
  SwaggerModule.setup('doc', app, document);

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    // process.exit(1);
  });

  await app.listen(PORT ?? 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
