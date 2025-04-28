import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ChatGptService } from './chat-gpt.service';
import {
  OrthographyDto,
  ProsConsDto,
  TranslateDto,
  ProsConsStreamDto,
  TranslateNativeDto,
  ImageGenerationDto,
  TextToAudioDto,
  AudioToTextDto,
  ImageVariationDto,
} from './dto';
import { Response } from 'express';
import { ChatGptWsGateway } from 'src/chat-gpt-ws/chat-gpt-ws.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file) return callback(new Error('File is empty'), false);

        const fileType = file.mimetype.split('/')[1];
        if (['m4a', 'mp4', 'mp3'].includes(fileType))
          return callback(null, true);

        //* Aca se puede hacer lo mismo que se hace en el ParseFilePipe:
        // if (file.size > 1000 * 1024 * 5)
        //   return callback(new Error('File is bigger tahn 5mb'), false);

        callback(new Error('Wrong file type'), false);
      },
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          if (!file) return callback(new Error('File is empty'), '');

          const fileType = file.mimetype.split('/')[1];
          const fileName = `${new Date().getTime()}.${fileType}`;

          callback(null, fileName);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger tahn 5mb',
          }),
          //* Aca se puede hacer lo mismo que en el fileFilter:
          //new FileTypeValidator({fileType: "audio/*"})
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.chatGptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return this.chatGptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:id')
  getImageGeneration(@Param('id') id: string, @Res() res: Response) {
    res.setHeader('Content-Type', 'image/png');
    res.status(HttpStatus.OK);

    const imagePath = this.chatGptService.getImagePath(id);

    res.sendFile(imagePath);
  }

  @Post('image-variation')
  imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.chatGptService.imageVariation(imageVariationDto);
  }
}
