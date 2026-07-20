import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Recruitment Project' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: 'Take-home project for the application', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;
}
