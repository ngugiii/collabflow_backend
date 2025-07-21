import { IsString, IsOptional, MinLength, IsEnum, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProjectStatus } from '@/common/enums/project-status.enum';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dueDate?: Date;
} 