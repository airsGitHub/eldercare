import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    this.logger.debug(`Login attempt for email: ${loginUserDto.email}`);
    try {
      const result = await this.authService.login(loginUserDto);
      this.logger.debug('Login successful');
      return result;
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw new HttpException(
        error.message || '登录失败',
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.debug(`Registration attempt for email: ${createUserDto.email}`);
    try {
      const result = await this.authService.register(createUserDto);
      this.logger.debug('Registration successful');
      return result;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw new HttpException(
        error.message || '注册失败',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('create-admin')
  async createAdmin() {
    try {
      this.logger.log('Attempting to create admin account...');
      
      // Check if admin already exists
      const existingAdmin = await this.usersService.findByEmail('admin@eldercare.com');
      if (existingAdmin) {
        this.logger.log('Admin account already exists');
        // Try to login with existing admin account
        return await this.authService.login({
          email: 'admin@eldercare.com',
          password: 'admin123'
        });
      }

      const adminData: CreateUserDto = {
        name: 'Admin',
        email: 'admin@eldercare.com',
        password: 'admin123',
        role: UserRole.ADMIN,
        avatar: 'https://via.placeholder.com/100'
      };
      
      this.logger.log('Creating new admin account...');
      const result = await this.authService.register(adminData);
      this.logger.log('Admin account created successfully');
      return result;
    } catch (error) {
      this.logger.error(`Failed to create admin: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Failed to create admin account',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
