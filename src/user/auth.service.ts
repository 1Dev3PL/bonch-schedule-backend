import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (oldUser) throw new BadRequestException('User not exist');

    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: password,
      },
    });

    const tokens = await this.issueTokens(oldUser.id);

    return {
      user: this.returnUserFields(createUserDto),
      ...tokens,
    };
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
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

  private returnUserFields(createUserDto: CreateUserDto) {
    return {
      email: createUserDto.email,
    };
  }
}
