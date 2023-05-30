import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroups() {
    return await this.prisma.groups.findMany();
  }
}
