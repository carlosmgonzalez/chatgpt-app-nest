import { IsString, MinLength } from 'class-validator';

export class TranslateNativeDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsString()
  @MinLength(1)
  readonly lang: string;

  @IsString()
  @MinLength(1)
  readonly clientId: string;
}
