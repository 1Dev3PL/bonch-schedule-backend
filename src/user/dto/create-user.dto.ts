import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4, {
    message: 'password must me at least 4 simbols',
  })
  @IsString()
  password: string;
}
