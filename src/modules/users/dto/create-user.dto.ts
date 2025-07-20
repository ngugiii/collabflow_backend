import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { UserRole } from '@/common/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
} 