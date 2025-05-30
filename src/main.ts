import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as yamljs from 'yamljs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
