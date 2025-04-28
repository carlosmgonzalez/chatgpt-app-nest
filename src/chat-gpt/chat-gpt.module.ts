import { forwardRef, Module } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { ChatGptController } from './chat-gpt.controller';
import { ChatGptWsModule } from 'src/chat-gpt-ws/chat-gpt-ws.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [ChatGptController],
  providers: [ChatGptService],
  imports: [forwardRef(() => ChatGptWsModule), ScheduleModule.forRoot()],
  exports: [ChatGptService],
})
export class ChatGptModule {}
