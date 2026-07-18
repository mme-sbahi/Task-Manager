import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ProjectRole } from '../enums/project-role.enum';

export class InviteMembersDto {
  @ApiProperty({
    example: ['teammate1@example.com', 'teammate2@example.com'],
    description: 'One or more emails to invite',
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(25)
  @IsEmail({}, { each: true })
  emails: string[];

  @ApiProperty({ enum: ProjectRole, required: false, default: ProjectRole.MEMBER })
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
