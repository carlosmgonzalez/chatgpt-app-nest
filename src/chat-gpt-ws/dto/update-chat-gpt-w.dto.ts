import { PartialType } from '@nestjs/mapped-types';
import { CreateChatGptWDto } from './create-chat-gpt-w.dto';

export class UpdateChatGptWDto extends PartialType(CreateChatGptWDto) {
  id: number;
}
