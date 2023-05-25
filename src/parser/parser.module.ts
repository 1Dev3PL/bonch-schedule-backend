import { Module } from '@nestjs/common';
import { BullModule } from "@nestjs/bull";
import { ParserService } from "./parser.service";
import { ParserProducerService } from "./parser.producer.service";
import { ParserConsumer } from "./parser.consumer";
import { ParserController } from "./parser.controller";
import { PrismaService } from "../prisma.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name:'parser-queue'
    }),
    HttpModule
  ],
  controllers: [ParserController],
  providers: [ParserService, ParserProducerService, ParserConsumer, PrismaService],
})
export class ParserModule {}
