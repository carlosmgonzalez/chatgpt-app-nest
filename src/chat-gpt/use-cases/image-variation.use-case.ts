import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadImageAsPng } from 'src/helpers/download-image-as-png';
import { BadRequestException } from '@nestjs/common';

const SERVER_URL = process.env.SERVER_URL;

export const imageVariationUseCase = async (
  openai: OpenAI,
  imageBaseUrl: string,
) => {
  const imageBasePath = await downloadImageAsPng(imageBaseUrl, true);

  const response = await openai.images.createVariation({
    model: 'dall-e-2',
    image: fs.createReadStream(imageBasePath!),
    n: 1,
    response_format: 'url',
  });

  const openAiUrl = response.data[0].url;
  if (!openAiUrl) throw new BadRequestException('openai url not exist');

  const imageName = await downloadImageAsPng(openAiUrl);
  const url = `${SERVER_URL}/chat-gpt/image-generation/${imageName}`;

  return {
    url,
    openAiUrl,
    revised_prompt: response.data[0].revised_prompt,
  };
};
