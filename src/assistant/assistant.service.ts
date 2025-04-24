import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { createThreadUseCase } from './use-cases/create-thread.use-case';
import { createMessageUseCase } from './use-cases/create-message.use-case';
import { QuestionDto } from './dto/question.dto';
import { createRunUseCase } from './use-cases/create-run.use-case';
import { checkRunStatusCompletedUseCase } from './use-cases/check-run-status-completed.use-case';
import { getMessagesThreadUseCase } from './use-cases/get-messages-thread.use-case';

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

    // Se creo el mensaje y se implementa al thread.
    await createMessageUseCase(this.openai, question, threadId);

    // Se ejecuta el run.
    const run = await createRunUseCase(this.openai, threadId);

    // Esperamos a que el run status se complete y tambien se devuelte el run por si algo.
    await checkRunStatusCompletedUseCase(this.openai, threadId, run.id);

    // Obtenemos los mensajes del thread mejor organizado [{role, content}];
    const messages = await getMessagesThreadUseCase(this.openai, threadId);

    return messages;
  }
}
