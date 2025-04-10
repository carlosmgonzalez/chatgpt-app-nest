import { Module } from '@nestjs/common';
import { ChatGptModule } from './chat-gpt/chat-gpt.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGptWsModule } from './chat-gpt-ws/chat-gpt-ws.module';

@Module({
  imports: [ChatGptModule, ConfigModule.forRoot(), ChatGptWsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
