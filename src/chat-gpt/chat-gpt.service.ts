import { Injectable } from '@nestjs/common';
import {
  checkOrtographyUseCase,
  prosConsUseCase,
  prosConsStreamUseCase,
} from './use-cases';
import { OrthographyDto, ProsConsDto } from './dto';
import OpenAI from 'openai';

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
}
