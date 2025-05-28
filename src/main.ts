import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './app.module';

import * as yamljs from 'yamljs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document: OpenAPIObject = yamljs.load('doc/api.yaml');
  SwaggerModule.setup('api', app, document);
  
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });

  // Add OpenApi documentation
  const options = {
    openApi: {
      enabled: true,  // Enable OpenAPI documentation
    },
  };

  await app.listen(process.env.PORT ?? 4000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
