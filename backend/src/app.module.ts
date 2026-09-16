import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { QuizzesModule } from './quizzes/quizzes.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, QuizzesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
