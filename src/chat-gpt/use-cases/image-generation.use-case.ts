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

    const url = await downloadImageAsPng(openAiUrl);

    return {
      url,
      openAiUrl,
      revised_prompt: response.data[0].revised_prompt,
    };
  }

  const maskPath = await downloadBase64ImageAsPng(maskImage);

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
  if (!openAiUrl) throw new Error('Url no exist');

  const url = await downloadImageAsPng(openAiUrl);
};
