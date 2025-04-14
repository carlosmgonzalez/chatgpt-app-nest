import OpenAI from 'openai';
import * as fs from 'fs';

export const audioToTextUseCase = async (
  openai: OpenAI,
  audioFile: Express.Multer.File,
  prompt?: string,
) => {
  const response = await openai.audio.transcriptions.create({
    model: 'gpt-4o-transcribe',
    file: fs.createReadStream(audioFile.path),
    prompt,
    language: 'es',
  });

  return response;
};
