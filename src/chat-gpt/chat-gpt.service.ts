import { Injectable, NotFoundException } from '@nestjs/common';
import {
  checkOrtographyUseCase,
  prosConsUseCase,
  prosConsStreamUseCase,
  translateUseCase,
  textToAudioUseCase,
  audioToTextUseCase,
  imageVariationUseCase,
} from './use-cases';
import {
  OrthographyDto,
  ProsConsDto,
  TranslateDto,
  TextToAudioDto,
  AudioToTextDto,
  ImageGenerationDto,
} from './dto';
import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { imageGenerationUseCase } from './use-cases/image-generation.use-case';
import { ImageVariationDto } from './dto/image-variation.dto';

@Injectable()
export class ChatGptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  checkOrthography(orthographyDto: OrthographyDto) {
    return checkOrtographyUseCase(this.openai, {
      prompt: orthographyDto.prompt,
    });
  }

  prosCons(prosConsDto: ProsConsDto) {
    return prosConsUseCase(this.openai, prosConsDto.prompt);
  }

  prosConsStream(prosConsDto: ProsConsDto) {
    return prosConsStreamUseCase(this.openai, prosConsDto.prompt);
  }

  translate(translateDto: TranslateDto) {
    return translateUseCase(this.openai, translateDto);
  }

  textToAudio(textToAudioDto: TextToAudioDto) {
    const { prompt, voice } = textToAudioDto;
    return textToAudioUseCase(this.openai, prompt, voice);
  }

  getfilePath(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      `../../generated/audios/${fileId}.mp3`,
    );

    const isFileExist = fs.existsSync(filePath);

    if (!isFileExist)
      throw new NotFoundException(`Not found audio with id: ${fileId}`);

    return filePath;
  }

  audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
    const { prompt } = audioToTextDto;
    return audioToTextUseCase(this.openai, audioFile, prompt);
  }

  imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return imageGenerationUseCase(this.openai, imageGenerationDto);
  }

  getImagePath(fileId: string) {
    const filePath = path.resolve(
      __dirname,
      `../../generated/images/${fileId}`,
    );

    const isFileExist = fs.existsSync(filePath);

    if (!isFileExist)
      throw new NotFoundException(`Not found audio with id: ${fileId}`);

    return filePath;
  }

  imageVariation(imageVariationDto: ImageVariationDto) {
    const { imageBaseUrl } = imageVariationDto;
    return imageVariationUseCase(this.openai, imageBaseUrl);
  }
}
