import { IsString, IsOptional, MinLength, IsEnum, IsUUID, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
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

  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  priority?: string;

  @IsUUID()
  projectId: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  dueDate?: Date;
} 