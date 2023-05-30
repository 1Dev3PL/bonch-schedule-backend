import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ScheduleService } from './schedule.service';
import { TransformInterceptor } from "./transform.interceptor";

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getSchedule(@Query('group') group) {
    return await this.scheduleService.getSchedule(group);
  }
}
