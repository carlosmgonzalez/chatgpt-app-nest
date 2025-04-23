import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { QuestionDto } from './dto/question.dto';
import { createRunUseCase } from './use-cases/create-run.use-case';

@Injectable()
export class AssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  createThread() {
    return createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { question, threadId } = questionDto;

    const message = await createMessageUseCase(this.openai, question, threadId);

    const run = await createRunUseCase(this.openai, threadId);

    console.log({ message });
    console.log({ run });
  }
}
