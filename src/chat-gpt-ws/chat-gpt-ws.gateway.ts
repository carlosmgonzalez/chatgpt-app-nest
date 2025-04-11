import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatGptService } from 'src/chat-gpt/chat-gpt.service';
import { ChatGptWsService } from './chat-gpt-ws.service';
import { ProsConsDto, TranslateDto } from 'src/chat-gpt/dto';
import { forwardRef, Inject, NotFoundException } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGptWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatGptWsService: ChatGptWsService,
    @Inject(forwardRef(() => ChatGptService))
    private readonly chatGptService: ChatGptService,
  ) {}

  handleConnection(client: Socket) {
    client.emit('connected client');
    this.chatGptWsService.addClient(client);
    console.log(client.id);
  }

  handleDisconnect(client: Socket) {
    this.chatGptWsService.removeClient(client);
    client.emit('disconnected client');
  }

  async sendStream(clientId: string, prosConsDto: ProsConsDto) {
    const client = this.chatGptWsService.getClient(clientId);
    const stream = await this.chatGptService.prosConsStream(prosConsDto);

    if (!client) throw new NotFoundException('Client not found');

    for await (const chunk of stream) {
      if (chunk.type === 'response.output_text.delta') {
        client.emit('stream-chunk', chunk.delta);
      }
    }

    client.emit('stream-end');
  }

  async sendStreamTranslate(clientId: string, translateDto: TranslateDto) {
    const client = this.chatGptWsService.getClient(clientId);
    const stream = await this.chatGptService.translate(translateDto);

    if (!client) throw new NotFoundException('Client not found');

    for await (const chunk of stream) {
      if (chunk.type === 'response.output_text.delta') {
        client.emit('stream-translate-chunk', chunk.delta);
      }
    }

    client.emit('stream-translate-end');
  }
}
