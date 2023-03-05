import { NestFactory } from '@nestjs/core';
import { CoreModule } from './services/core/core.module';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule);

  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}
bootstrap();
