import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service.js';
import { CreateQuizDto } from './dto/create-quiz.dto.js';
import { QuizDetailDto, QuizSummaryDto } from './dto/quiz-response.dto.js';
import { CreateSubmissionDto } from './dto/create-submission.dto.js';
import { SubmissionCreatedDto, SubmissionSummaryDto } from './dto/submission-response.dto.js';

@ApiTags('quizzes')
@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  create(@Body() dto: CreateQuizDto): Promise<QuizDetailDto> {
    return this.quizzesService.create(dto);
  }

  @Get()
  findAll(): Promise<QuizSummaryDto[]> {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<QuizDetailDto> {
    return this.quizzesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.quizzesService.remove(id);
  }

  @Post(':id/submissions')
  createSubmission(@Param('id') id: string, @Body() dto: CreateSubmissionDto): Promise<SubmissionCreatedDto> {
    return this.quizzesService.createSubmission(id, dto);
  }

  @Get(':id/submissions')
  listSubmissions(@Param('id') id: string): Promise<SubmissionSummaryDto[]> {
    return this.quizzesService.listSubmissions(id);
  }
}
