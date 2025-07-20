import { IsUUID } from 'class-validator';

export class RemoveResourceDto {
  @IsUUID()
  userId: string;
} 