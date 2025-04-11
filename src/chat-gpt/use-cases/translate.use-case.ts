import OpenAI from 'openai';
import { TranslateDto } from '../dto';

export const translateUseCase = async (
  openai: OpenAI,
  translateDto: TranslateDto,
) => {
  const { lang, prompt } = translateDto;

  const response = await openai.responses.create({
    model: 'gpt-4o',
    stream: true,
    instructions: `Traduceme el siguiente texto a ${lang}`,
    input: prompt,
  });

  return response;
};
