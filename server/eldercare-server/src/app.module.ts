import { Module, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        const uri = configService.get<string>('MONGODB_URI');
        
        logger.log('Attempting to connect to MongoDB...');
        
        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              logger.log('Successfully connected to MongoDB');
            });
            connection.on('error', (error) => {
              logger.error(`MongoDB connection error: ${error.message}`, error.stack);
            });
            connection.on('disconnected', () => {
              logger.warn('Disconnected from MongoDB');
            });
            return connection;
          }
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationShutdown {
  private readonly logger = new Logger(AppModule.name);

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Received shutdown signal: ${signal}`);
    try {
      await mongoose.disconnect();
      this.logger.log('Disconnected from MongoDB');
    } catch (error) {
      this.logger.error('Error disconnecting from MongoDB:', error.stack);
    }
  }
}
