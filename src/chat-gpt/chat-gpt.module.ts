import { forwardRef, Module } from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { ChatGptController } from './chat-gpt.controller';
import { ChatGptWsModule } from 'src/chat-gpt-ws/chat-gpt-ws.module';

@Module({
  controllers: [ChatGptController],
  providers: [ChatGptService],
  imports: [forwardRef(() => ChatGptWsModule)],
  exports: [ChatGptService],
})
export class ChatGptModule {}
