import { IsString, MinLength } from 'class-validator';

export class ProsConsDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;
}
