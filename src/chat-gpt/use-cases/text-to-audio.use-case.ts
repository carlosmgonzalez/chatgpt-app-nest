import OpenAI from 'openai';
import * as path from 'path';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

const voices = [
  'alloy',
  'ash',
  'ballad',
  'coral',
  'echo',
  'fable',
  'onyx',
  'nova',
  'sage',
  'shimmer',
  'verse',
];

export const textToAudioUseCase = async (
  openai: OpenAI,
  prompt: string,
  voice?: string,
) => {
  let selectedVoice = 'nova';
  if (voice && voices.includes(voice)) selectedVoice = voice;

  try {
    const folderPath = path.resolve(__dirname, '../../../generated/audios/');
    fs.mkdirSync(folderPath, { recursive: true });

    const speechFile = path.resolve(folderPath, `${new Date().getTime()}.mp3`);

    const mp3 = await openai.audio.speech.create({
      model: 'gpt-4o-mini-tts',
      voice: selectedVoice,
      input: prompt,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    fs.writeFileSync(speechFile, buffer);

    return speechFile;
  } catch (error) {
    console.log(error);
    throw new BadRequestException(
      'Something went wrong while genetaring audio',
    );
  }
};
