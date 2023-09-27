import { IsNumber, IsString, MinLength } from 'class-validator';

export class AuthResetPasswordDTO {
  @IsString()
  @MinLength(6)
  password: string;

  @IsNumber()
  id: number;
}
