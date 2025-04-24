import { IsString } from 'class-validator';

export class LoadMessagesDto {
  @IsString()
  readonly threadId: string;
}
