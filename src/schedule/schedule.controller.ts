import { Controller, Get, Query } from "@nestjs/common";
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  async getSchedule(@Query('group') group) {
    return await this.scheduleService.getSchedule(group);
  }

}
