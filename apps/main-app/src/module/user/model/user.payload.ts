import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SignWithEmailPayload {
  @ApiProperty({ example: 'sample@example.com', description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '1234', description: 'password' })
  @IsString()
  password: string

  @ApiPropertyOptional({ example: 'John Doe', description: 'name' })
  @IsOptional()
  @IsString()
  name?: string
}

export class LoginWithEmailPayload {
  @ApiProperty({ example: 'sample@example.com', description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '1234', description: 'password' })
  @IsString()
  password: string
}
