import { Controller, Get } from '@nestjs/common';
import { ParserProducerService } from './parser.producer.service';
import { ParserService } from './parser.service';

@Controller('parser')
export class ParserController {
  constructor(
    private readonly parserProducerService: ParserProducerService,
    private readonly parserService: ParserService,
  ) {}

  @Get('start')
  async startScheduleParsing() {
    await this.parserProducerService.startScheduleParsing();
    return 'Parsing started';
  }

  @Get('schedule')
  async getSchedule() {
    return await this.parserService.getSchedule();
  }
}
