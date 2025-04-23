import { Body, Controller, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { QuestionDto } from './dto/question.dto';

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
}
