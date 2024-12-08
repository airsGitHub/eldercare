import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    this.logger.debug(`Creating user with email: ${createUserDto.email}`);
    try {
      const createdUser = await this.userModel.create(createUserDto);
      this.logger.debug(`User created successfully: ${createdUser.email}`);
      return createdUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      if (error.code === 11000) {
        throw new ConflictException('该邮箱已被注册');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserDocument[]> {
    this.logger.debug('Finding all users');
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    this.logger.debug(`Finding user by id: ${id}`);
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      this.logger.debug(`User not found with id: ${id}`);
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    this.logger.debug(`Finding user by email: ${email}`);
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      this.logger.debug(`User not found with email: ${email}`);
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    this.logger.debug(`Updating user with id: ${id}`);
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-password')
        .exec();

      if (!updatedUser) {
        this.logger.debug(`User not found with id: ${id}`);
        throw new NotFoundException('用户不存在');
      }

      this.logger.debug(`User updated successfully: ${updatedUser.email}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      if (error.code === 11000) {
        throw new ConflictException('该邮箱已被注册');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<UserDocument> {
    this.logger.debug(`Removing user with id: ${id}`);
    const deletedUser = await this.userModel
      .findByIdAndDelete(id)
      .select('-password')
      .exec();

    if (!deletedUser) {
      this.logger.debug(`User not found with id: ${id}`);
      throw new NotFoundException('用户不存在');
    }

    this.logger.debug(`User removed successfully: ${deletedUser.email}`);
    return deletedUser;
  }
}
