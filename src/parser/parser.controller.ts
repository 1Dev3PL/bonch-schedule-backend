import { Controller, Get } from '@nestjs/common';
import { ParserProducerService } from './parser.producer.service';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserProducerService: ParserProducerService) {}

  @Get('groups')
  async startGroupsParsing() {
    await this.parserProducerService.startGroupsParsing();
    return 'Groups parsing started';
  }

  @Get('schedule')
  async startScheduleParsing() {
    await this.parserProducerService.startScheduleParsing();
    return 'Schedule parsing started';
  }
}
