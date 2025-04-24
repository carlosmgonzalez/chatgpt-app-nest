import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { QuestionDto } from './dto/question.dto';
import { LoadMessagesDto } from './dto/load-messages.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('create-thread')
  createThread() {
    return this.assistantService.createThread();
  }

  @Post('user-question')
  userQuestion(@Body() questionDto: QuestionDto) {
    return this.assistantService.userQuestion(questionDto);
  }

  @Post('load-messages')
  loadMessages(@Body() loadMessagesDto: LoadMessagesDto) {
    return this.assistantService.loadMessages(loadMessagesDto);
  }
}
