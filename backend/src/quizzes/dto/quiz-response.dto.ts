import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';

export class QuestionResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  text!: string;

  @ApiProperty({ enum: QuestionType })
  type!: QuestionType;

  @ApiProperty()
  order!: number;

  @ApiProperty({ required: false, nullable: true })
  correctBoolean!: boolean | null;

  @ApiProperty({ required: false, nullable: true })
  correctText!: string | null;

  @ApiProperty({ required: false, nullable: true, type: [String] })
  options!: string[] | null;

  @ApiProperty({ required: false, nullable: true, type: [String] })
  correctOptions!: string[] | null;
}

export class QuizSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  questionCount!: number;
}

export class QuizDetailDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ type: [QuestionResponseDto] })
  questions!: QuestionResponseDto[];
}
