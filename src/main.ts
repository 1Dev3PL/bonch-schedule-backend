import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.setGlobalPrefix('api');
  app.enableCors();

  await app.listen(4200, '192.168.31.214', function () {
    console.log('server started on port 4200');
  });

  // await app.listen(4200);
}
bootstrap();
