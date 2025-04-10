import {
  Body,
  Controller,
  forwardRef,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import { OrthographyDto, ProsConsDto } from './dto';
import { Response } from 'express';
import { ChatGptWsGateway } from 'src/chat-gpt-ws/chat-gpt-ws.gateway';
import { ProsConsStreamDto } from './dto/pros-cons-stream.dto';

@Controller('chat-gpt')
export class ChatGptController {
  constructor(
    private readonly chatGptService: ChatGptService,
    @Inject(forwardRef(() => ChatGptWsGateway))
    private chatGptWsGateway: ChatGptWsGateway,
  ) {}

  @Post('check-orthography')
  checkOrthography(@Body() orthographyDto: OrthographyDto) {
    return this.chatGptService.checkOrthography(orthographyDto);
  }

  @Post('pros-cons')
  prosCons(@Body() prosConsDto: ProsConsDto) {
    return this.chatGptService.prosCons(prosConsDto);
  }

  @Post('pros-cons-stream')
  async prosConsStream(@Body() prosConsDto: ProsConsDto, @Res() res: Response) {
    const stream = await this.chatGptService.prosConsStream(prosConsDto);
    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      if (chunk.type === 'response.output_text.delta') {
        const piece = chunk.delta;
        console.log(piece);
        res.write(piece);
      }
    }

    res.end();
  }

  @Post('pros-cons-stream-native')
  async prosConsStreamNative(@Body() prosConsSteamDto: ProsConsStreamDto) {
    const { clientId, prompt } = prosConsSteamDto;
    await this.chatGptWsGateway.sendStream(clientId, { prompt });
  }
}
