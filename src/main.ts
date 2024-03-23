import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { MyLogger } from './components/logger/logger.service';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(MyLogger));

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
  console.info(`Server start on http://localhost:${PORT}`);

  await app.listen(PORT);
}
bootstrap();
