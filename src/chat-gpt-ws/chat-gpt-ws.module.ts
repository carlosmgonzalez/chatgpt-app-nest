import { forwardRef, Module } from '@nestjs/common';
import { ChatGptWsService } from './chat-gpt-ws.service';
import { ChatGptWsGateway } from './chat-gpt-ws.gateway';
import { ChatGptModule } from 'src/chat-gpt/chat-gpt.module';

@Module({
  providers: [ChatGptWsGateway, ChatGptWsService],
  imports: [forwardRef(() => ChatGptModule)],
  exports: [ChatGptWsGateway],
})
export class ChatGptWsModule {}
