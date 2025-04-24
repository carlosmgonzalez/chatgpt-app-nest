import { BadRequestException } from '@nestjs/common';
import OpenAI from 'openai';

export const checkRunStatusCompletedUseCase = async (
  openai: OpenAI,
  threadId: string,
  runId: string,
) => {
  let attempts = 0;
  const maxAttempts = 60; // Es como esperar maximo 1 minuto;

  while (attempts < maxAttempts) {
    try {
      const run = await openai.beta.threads.runs.retrieve(threadId, runId);

      console.log(
        `Status: ${run.status} - Attempt: ${attempts + 1}/${maxAttempts}`,
      );

      if (run.status === 'completed') return run;

      if (run.status === 'failed' || run.status === 'cancelled')
        throw new BadRequestException(`Run ended with status: ${run.status}`);

      attempts++;
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    } catch (error) {
      throw new BadRequestException(`Error checking run status: ${error}`);
    }
  }

  throw new BadRequestException(
    'Maximum attempts reached while checking run status',
  );
};
