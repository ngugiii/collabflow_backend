import { IsString, IsOptional, MinLength, IsEnum, IsUUID } from 'class-validator';
import { TaskStatus } from '@/common/enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
} 