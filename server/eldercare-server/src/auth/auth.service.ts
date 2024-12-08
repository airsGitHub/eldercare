import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    this.logger.debug(`Validating user: ${email}`);
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        this.logger.debug(`User not found: ${email}`);
        throw new UnauthorizedException('用户不存在');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.debug(`Invalid password for user: ${email}`);
        throw new UnauthorizedException('密码错误');
      }

      const userJson = user.toJSON();
      delete userJson.password;
      this.logger.debug(`User validated successfully: ${email}`);
      return userJson;
    } catch (error) {
      this.logger.error(`Error in validateUser: ${error.message}`);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    this.logger.debug(`Processing login for: ${loginDto.email}`);
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      const payload = {
        email: user.email,
        sub: user._id,
        role: user.role.toUpperCase(), 
      };

      this.logger.debug(`Creating JWT token for user: ${loginDto.email}`);
      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role.toUpperCase(), 
          avatar: user.avatar,
        },
      };
    } catch (error) {
      this.logger.error(`Login failed for ${loginDto.email}: ${error.message}`);
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.debug(`Processing registration for: ${createUserDto.email}`);
    try {
      // 检查邮箱是否已存在
      const existingUser = await this.usersService.findByEmail(createUserDto.email).catch(() => null);
      if (existingUser) {
        throw new ConflictException('该邮箱已被注册');
      }

      // 创建新用户
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      const payload = {
        email: user.email,
        sub: user._id,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);
      const userJson = user.toJSON();
      delete userJson.password;

      this.logger.debug(`Registration successful for: ${createUserDto.email}`);
      return {
        access_token: token,
        user: userJson,
      };
    } catch (error) {
      this.logger.error(`Registration failed for ${createUserDto.email}: ${error.message}`);
      throw error;
    }
  }
}
