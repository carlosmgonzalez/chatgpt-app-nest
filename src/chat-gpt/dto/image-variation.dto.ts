import { IsString, MinLength } from 'class-validator';

export class ImageVariationDto {
  @IsString()
  @MinLength(1)
  readonly imageBaseUrl: string;
}
