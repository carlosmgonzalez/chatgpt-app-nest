import OpenAI from 'openai';

export const createMessageUseCase = async (
  openai: OpenAI,
  question: string,
  threadId: string,
) => {
  const message = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });

  return message;
};
