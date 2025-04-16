import { IsOptional, IsString, MinLength } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly originalImage?: string;

  @IsString()
  @IsOptional()
  readonly maskImage?: string;
}
