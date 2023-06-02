import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ParserModule } from './parser/parser.module';
import { ScheduleModule } from './schedule/schedule.module';
import { GroupsModule } from './groups/groups.module';
import { MailerConfigModule } from './user/auth.mailer.module';

@Module({
  imports: [
    AuthModule,
    ParserModule,
    ConfigModule.forRoot(),
    ScheduleModule,
    GroupsModule,
    MailerConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
