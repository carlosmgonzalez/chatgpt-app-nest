import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ChatGptWsService {
  private clients = new Map<string, Socket>();

  addClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  removeClient(client: Socket) {
    this.clients.delete(client.id);
  }

  getClient(clientId: string) {
    return this.clients.get(clientId);
  }
}
