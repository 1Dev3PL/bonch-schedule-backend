import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups() {
    const data = await this.prisma.groups.findMany();
    return {
      data,
    };
  }
}
