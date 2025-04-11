import { IsString, MinLength } from 'class-validator';

export class TranslateDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsString()
  @MinLength(1)
  readonly lang: string;
}
