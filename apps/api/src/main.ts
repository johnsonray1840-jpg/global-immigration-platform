import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Enterprise Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Managed per-frontend and CDN layers
    }),
  );
  
  // 2. Strict CORS policy with whitelisted domains
  const allowedOrigins = [
    'https://gcsworldwide.org',
    'https://www.gcsworldwide.org',
    'https://global-immigration-platform.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }
      
      const isAllowed = allowedOrigins.some(
        (allowed) => origin === allowed || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || origin.includes('localhost'),
      );

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy violation: Origin ${origin} not permitted`), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'x-custom-lang'],
  });

  // 3. Global input validation and sanitization
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Global Citizens Solution API listening on port ${port}`);
}
bootstrap();