import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SignWithEmailPayload {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  name?: string
}

export class LoginWithEmailPayload {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
