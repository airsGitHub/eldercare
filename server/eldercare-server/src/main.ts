import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();
  
  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Test MongoDB connection
  try {
    const uri = configService.get<string>('MONGODB_URI');
    logger.log('Testing MongoDB connection...');
    await mongoose.connect(uri);
    logger.log('MongoDB connection test successful');
  } catch (error) {
    logger.error('MongoDB connection test failed:', error.message);
    process.exit(1);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
