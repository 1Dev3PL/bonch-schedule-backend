import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password } = registerUserDto;

    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (oldUser) throw new BadRequestException('User already exist');

    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: await hash(password),
      },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(registerUserDto),
      ...tokens,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return {
      users: users,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    const tokens = await this.issueTokens(user.id);

    return {
      email: user.email,
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(registerUserDto: RegisterUserDto) {
    return {
      email: registerUserDto.email,
    };
  }

  private async validateUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) throw new NotFoundException('User not exist');

    const isValidPassword = await verify(user.password, loginUserDto.password);

    if (!isValidPassword) throw new UnauthorizedException('Password invalid');

    return user;
  }
}
