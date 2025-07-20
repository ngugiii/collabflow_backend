import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from '@/common/enums/user-role.enum';

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
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 