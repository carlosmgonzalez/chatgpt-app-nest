import { IsOptional, IsString, MinLength } from 'class-validator';

export class TextToAudioDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsString()
  @IsOptional()
  readonly voice: string;
}
