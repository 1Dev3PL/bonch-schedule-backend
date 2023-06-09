import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto, IsRightPassword } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post('register')
  register(@Body() RegisterUserDto: RegisterUserDto) {
    return this.userService.register(RegisterUserDto);
  }

  @Get('password')
  isRightPassword(@Body() data: IsRightPassword) {
    return this.userService.isRightPassword(data);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get('forgot')
  forgot(@Body('email') email: string) {
    return this.userService.forgot(email);
  }

  @Get('get')
  findAll() {
    return this.userService.findAll();
  }
}
