import { IsString, IsOptional, MinLength, IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '@/common/enums/task-status.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
} 