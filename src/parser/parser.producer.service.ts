import { Injectable } from '@nestjs/common';
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class ParserProducerService {
  constructor(@InjectQueue('parser-queue') private queue: Queue) {}

  async startScheduleParsing() {
    await this.queue.add('parser-job');
  }
}
