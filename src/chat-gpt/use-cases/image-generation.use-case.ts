import OpenAI from 'openai';
import { ImageGenerationDto } from '../dto';
import {
  downloadBase64ImageAsPng,
  downloadImageAsPng,
} from 'src/helpers/download-image-as-png';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export const imageGenerationUseCase = async (
  openai: OpenAI,
  imageGenerationDto: ImageGenerationDto,
) => {
  const SERVER_URL = process.env.SERVER_URL;

  const { prompt, maskImage, originalImage } = imageGenerationDto;

  if (!maskImage || !originalImage) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      response_format: 'url',
    });

    const openAiUrl = response.data[0].url;
    if (!openAiUrl) throw new Error('Url no exist');

    const imageName = await downloadImageAsPng(openAiUrl);
    const url = `${SERVER_URL}/chat-gpt/image-generation/${imageName}`;

    return {
      url,
      openAiUrl,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  // const imagePath = await downloadImageAsPng();
  const maskPath = await downloadBase64ImageAsPng(maskImage, true);

  if (!maskPath)
    throw new BadRequestException('Mask image could not be download');

  const response = await openai.images.edit({
    model: 'dall-e-3',
    prompt,
    image: fs.createReadStream(originalImage),
    mask: fs.createReadStream(maskPath),
    n: 1,
    response_format: 'url',
  });

  const openAiUrl = response.data[0].url;
  if (!openAiUrl) throw new BadRequestException('OpenAiUrl not exist');

  const imageName = await downloadImageAsPng(openAiUrl);
  const url = `${SERVER_URL}/chat-gpt/image-generation/${imageName}`;

  return {
    url,
    openAiUrl,
    revised_prompt: response.data[0].revised_prompt,
  };
};
