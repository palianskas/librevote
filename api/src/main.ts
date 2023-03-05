import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}
bootstrap();
