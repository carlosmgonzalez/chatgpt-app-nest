import OpenAI from 'openai';

export const createRunUseCase = async (openai: OpenAI, threadId: string) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: 'asst_BjZhYSAc9znRZuYf9njFqD2w',
  });

  return run;
};
