import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

async function bootstrap() {
  config();
  const PORT = process.env.PORT ?? 4000;
  const app = await NestFactory.create(AppModule);
  console.info(`Server start on http://localhost:${PORT}`);

  await app.listen(PORT);
}
bootstrap();
