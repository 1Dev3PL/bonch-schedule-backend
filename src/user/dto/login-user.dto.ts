import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user.dto';

export class LoginUserDto extends PartialType(RegisterUserDto) {
  email: string;
  password: string;
}

export class IsRightPassword {
  email: string;
  password: string;
}