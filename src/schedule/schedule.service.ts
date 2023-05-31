import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async getSchedule(group: string) {
    const data = await this.prisma.schedule.findMany({
      where: {
        group: group
      }
    });
    return {
      data,
    };
  }
}
