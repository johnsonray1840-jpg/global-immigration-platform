import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or from allowed frontends
      if (!origin || origin.includes('localhost') || origin.endsWith('.onrender.com') || (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Global Citizens Solution API listening on port ${port}`);
}
bootstrap();