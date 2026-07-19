import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'meryeme@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', minLength: 8 })
  @IsString()
  @Length(8, 72)
  password: string;

  @ApiProperty({ example: 'Meryeme El Amrani' })
  @IsString()
  @Length(2, 100)
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
