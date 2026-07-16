import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ProjectRole } from '../enums/project-role.enum';

export class AddMemberDto {
  @ApiProperty({ example: 'teammate@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ProjectRole, required: false, default: ProjectRole.MEMBER })
  @IsOptional()
  @IsEnum(ProjectRole)
  role?: ProjectRole;
}
