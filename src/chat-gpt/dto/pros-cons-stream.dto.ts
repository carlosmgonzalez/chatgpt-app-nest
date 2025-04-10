import { IsString, MinLength } from 'class-validator';

export class ProsConsStreamDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsString()
  @MinLength(1)
  readonly clientId: string;
}
