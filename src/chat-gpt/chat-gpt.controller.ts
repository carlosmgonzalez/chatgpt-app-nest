import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import {
  OrthographyDto,
  ProsConsDto,
  TranslateDto,
  ProsConsStreamDto,
  TranslateNativeDto,
} from './dto';
import { Response } from 'express';
import { ChatGptWsGateway } from 'src/chat-gpt-ws/chat-gpt-ws.gateway';
import { TextToAudioDto } from './dto/text-to-audio.dto';

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

  @Post('translate')
  async translate(@Body() translateDto: TranslateDto, @Res() res: Response) {
    const stream = await this.chatGptService.translate(translateDto);

    res.setHeader('Type-Content', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      if (chunk.type === 'response.output_text.delta') {
        const piece = chunk.delta;
        res.write(piece);
      }
    }

    res.end();
  }

  @Post('translate-stream-native')
  @HttpCode(HttpStatus.OK)
  async translateNative(@Body() translateNativeDto: TranslateNativeDto) {
    const { clientId, prompt, lang } = translateNativeDto;
    await this.chatGptWsGateway.sendStreamTranslate(clientId, { prompt, lang });
  }

  @Post('text-to-audio')
  async textToAudio(
    @Body() textToAudioDto: TextToAudioDto,
    @Res() res: Response,
  ) {
    const filePath = await this.chatGptService.textToAudio(textToAudioDto);
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);

    res.sendFile(filePath);
  }

  @Get('text-to-audio/:id')
  getAudio(@Param('id') id: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);

    const filePath = this.chatGptService.getfilePath(id);

    res.sendFile(filePath);
  }
}
