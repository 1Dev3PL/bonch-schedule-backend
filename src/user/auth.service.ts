import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsRightPassword, LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly mailerService: MailerService,
  ) {}

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
      email: user.createdAt,
      ...tokens,
    };
  }

  async isRightPassword(data: IsRightPassword) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return false;
    }

    const isPassword = await verify(user.password, password);

    if (!isPassword) {
      return false;
    }

    return true;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return {
      users,
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

  async forgot(email: string) {
    const newPassword = this.generatePassword();

    await this.mailerService.sendMail({
      to: email,
      subject: 'Сброс пароля',
      template: './welcome', // `.hbs` extension is appended automatically
    });

    return {
      message: 'Вы успешно сбросили пароль!',
    };
  }

  private async generatePassword() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < this.randomIntFromInterval(6, 10)) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  private randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
