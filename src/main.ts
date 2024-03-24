import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from './components/logger/logger.service';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter.filter';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception - ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.warn(`Uncaught Rejection (may be in promise) - ${reason}`);
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('The home library')
    .setDescription('The my home library API')
    .setVersion('1.0')
    .addTag('home-library')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // const document: OpenAPIObject = jamljs.load('./doc/api.yaml') // lalternative
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      yamlDocumentUrl: '../doc/api.yaml',
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  const PORT = process.env.PORT ?? 4000;
  logger.warn(`Server start on http://localhost:${PORT}`);

  await app.listen(PORT);
}
bootstrap();
