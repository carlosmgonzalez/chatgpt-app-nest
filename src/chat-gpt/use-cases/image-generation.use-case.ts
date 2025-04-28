import OpenAI from 'openai';
import { ImageGenerationDto } from '../dto';
// import { downloadImageAsPng } from 'src/helpers/download-image-as-png';
import { BadRequestException } from '@nestjs/common';

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface OpenAIError extends Error {
  status?: number;
  message: string;
}

export const imageGenerationUseCase = async (
  openai: OpenAI,
  imageGenerationDto: ImageGenerationDto,
) => {
  // const SERVER_URL = process.env.SERVER_URL;
  const { prompt } = imageGenerationDto;

  let retries = 0;
  let lastError: OpenAIError | undefined;

  while (retries < MAX_RETRIES) {
    try {
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        response_format: 'url',
      });

      const openAiUrl = response.data[0].url;
      if (!openAiUrl) throw new Error('Url no exist');

      // const imageName = await downloadImageAsPng(openAiUrl);
      // const url = `${SERVER_URL}/chat-gpt/image-generation/${imageName}`;

      return {
        url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png',
        openAiUrl,
        revised_prompt: response.data[0].revised_prompt,
      };
    } catch (error: unknown) {
      const openAIError = error as OpenAIError;
      lastError = openAIError;

      if (openAIError.status === 429) {
        // Rate limit error
        const retryDelay = INITIAL_RETRY_DELAY * Math.pow(2, retries);
        console.log(`Rate limited. Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retries++;
      } else {
        // Other errors, throw immediately
        throw new BadRequestException(
          `Something went wrong while generating image: ${openAIError.message}`,
        );
      }
    }
  }

  // If we've exhausted all retries
  throw new BadRequestException(
    `Failed to generate image after ${MAX_RETRIES} retries. Last error: ${lastError?.message}`,
  );
};
