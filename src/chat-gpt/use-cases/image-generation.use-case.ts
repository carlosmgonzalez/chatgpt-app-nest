import OpenAI from 'openai';
import { ImageGenerationDto } from '../dto';
import { downloadImageAsPng } from 'src/helpers/download-image-as-png';
import { BadRequestException } from '@nestjs/common';

export const imageGenerationUseCase = async (
  openai: OpenAI,
  imageGenerationDto: ImageGenerationDto,
) => {
  const SERVER_URL = process.env.SERVER_URL;

  const { prompt } = imageGenerationDto;

  try {
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
  } catch (error) {
    console.log(error);
    throw new BadRequestException(
      `Something went wrong while generating image`,
    );
  }
};
