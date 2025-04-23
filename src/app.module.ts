import { Module } from '@nestjs/common';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGptWsModule } from './chat-gpt-ws/chat-gpt-ws.module';
import { AssistantModule } from './assistant/assistant.module';

@Module({
  imports: [
    ChatGptModule,
    ConfigModule.forRoot(),
    ChatGptWsModule,
    AssistantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
