import { NestFactory }                        from '@nestjs/core';
import { ValidationPipe }                     from '@nestjs/common';
import { SwaggerModule, DocumentBuilder }     from '@nestjs/swagger';
import { AppModule }                          from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    transform:            true,
    whitelist:            true,
    forbidNonWhitelisted: true,
  }));

  // ── Swagger ────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('API de Adopción de Animales')
    .setDescription('Gestión de animales, usuarios y solicitudes de adopción')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });
  // UI  → http://localhost:3000/api/docs
  // JSON → http://localhost:3000/api/docs-json

  await app.listen(3000);
}

bootstrap();
