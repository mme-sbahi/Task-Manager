import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Leet Recruitment Project' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ example: 'Take-home project for the Leet application', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;
}
