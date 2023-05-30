import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueStalled, Process, Processor } from "@nestjs/bull";
import { Job } from 'bull';
import { ParserService } from "./parser.service";

@Processor('parser-queue')
export class ParserConsumer {
  constructor(
    private readonly parserService: ParserService
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(
      `Job ${job.id} of type ${job.name} was completed`,
    );
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    console.log(
      `Job ${job.id} of type ${job.name} was stalled`,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(
      `Job ${job.id} of type ${job.name} was failed, reason: ${err}`,
    );
  }

  @Process('parse-groups-job')
  async ParseGroupsJob(job: Job<unknown>) {
    await this.parserService.parseGroups();
  }

  @Process('parse-schedule-job')
  async ParseScheduleJob(job: Job<unknown>) {
    await this.parserService.parseSchedule();
  }
}
