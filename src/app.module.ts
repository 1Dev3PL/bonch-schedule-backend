import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user/auth.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ParserService } from './parser/parser.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [AuthModule, ParserModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PrismaService, ParserService],
})
export class AppModule {}
