import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  console.log(`Application is running`);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
