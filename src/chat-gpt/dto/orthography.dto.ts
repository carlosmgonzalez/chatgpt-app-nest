import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class OrthographyDto {
  @IsString()
  @MinLength(1)
  readonly prompt: string;

  @IsInt()
  @IsOptional()
  readonly maxToken: string;
}
