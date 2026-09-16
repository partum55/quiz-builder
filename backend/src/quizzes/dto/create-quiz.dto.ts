import { ArrayMaxSize, ArrayMinSize, IsNotEmpty, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionDto } from './question.dto.js';
import { MAX_QUESTIONS_PER_QUIZ, MAX_TEXT_LENGTH } from './limits.js';

export class CreateQuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'title must not be whitespace only' })
  @MaxLength(MAX_TEXT_LENGTH)
  title!: string;

  @ApiProperty({ type: [QuestionDto] })
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_QUESTIONS_PER_QUIZ)
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}
