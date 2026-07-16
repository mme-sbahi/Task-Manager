import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';
import { Priority } from '../enums/priority.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Navbar redesign' })
  @IsString()
  @Length(3, 150)
  title: string;

  @ApiProperty({ required: false, example: 'Rebuild the navbar with the new design tokens' })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @ApiProperty({ enum: TaskStatus, required: false, default: TaskStatus.TODO })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiProperty({ enum: Priority, required: false, default: Priority.MEDIUM })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({ required: false, example: '2026-08-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ required: false, description: 'User id to assign the task to' })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
