import { IsEmail, IsString, IsEnum, MinLength, IsOptional, IsUrl } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;
}
