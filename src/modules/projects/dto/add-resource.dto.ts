import { IsUUID, IsArray } from 'class-validator';

export class AddResourceDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
} 