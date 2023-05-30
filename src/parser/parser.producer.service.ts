import { Injectable } from '@nestjs/common';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class ParserProducerService {
  constructor(@InjectQueue('parser-queue') private queue: Queue) {}

  async startGroupsParsing() {
    await this.queue.add('parse-groups-job');
  }

  async startScheduleParsing() {
    await this.queue.add('parse-schedule-job');
  }
}
