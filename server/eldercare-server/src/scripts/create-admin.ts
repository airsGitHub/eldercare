import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await usersService.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: UserRole.ADMIN,
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
