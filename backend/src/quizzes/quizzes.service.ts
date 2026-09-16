import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuizDto } from './dto/create-quiz.dto.js';
import { QuestionResponseDto, QuizDetailDto, QuizSummaryDto } from './dto/quiz-response.dto.js';
import { AnswerDto, CreateSubmissionDto } from './dto/create-submission.dto.js';
import { SubmissionCreatedDto, SubmissionSummaryDto } from './dto/submission-response.dto.js';

const questionWithOrder = { orderBy: { order: 'asc' as const } };

/** Scores one answer against its question's stored correct value(s). Missing/mismatched-shape answers just score as incorrect — no separate cross-field validation needed. */
function isAnswerCorrect(
  question: {
    type: string;
    correctBoolean: boolean | null;
    correctText: string | null;
    correctOptions: Prisma.JsonValue;
  },
  answer: AnswerDto | undefined,
): boolean {
  if (!answer) return false;

  switch (question.type) {
    case 'BOOLEAN':
      return answer.booleanValue === question.correctBoolean;
    case 'INPUT':
      return (answer.textValue ?? '').trim().toLowerCase() === (question.correctText ?? '').trim().toLowerCase();
    case 'CHECKBOX': {
      const correct = (question.correctOptions as string[] | null) ?? [];
      const selected = answer.selectedOptions ?? [];
      return correct.length === selected.length && correct.every((option) => selected.includes(option));
    }
    default:
      return false;
  }
}

function toQuestionResponse(question: {
  id: string;
  text: string;
  type: string;
  order: number;
  correctBoolean: boolean | null;
  correctText: string | null;
  options: Prisma.JsonValue;
  correctOptions: Prisma.JsonValue;
}): QuestionResponseDto {
  return {
    id: question.id,
    text: question.text,
    type: question.type as QuestionResponseDto['type'],
    order: question.order,
    correctBoolean: question.correctBoolean,
    correctText: question.correctText,
    options: question.options as string[] | null,
    correctOptions: question.correctOptions as string[] | null,
  };
}

@Injectable()
export class QuizzesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateQuizDto): Promise<QuizDetailDto> {
    const created = await this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            order: index,
            correctBoolean: question.correctBoolean,
            correctText: question.correctText,
            options: question.options,
            correctOptions: question.correctOptions,
          })),
        },
      },
    });

    return this.findOne(created.id);
  }

  async findAll(): Promise<QuizSummaryDto[]> {
    const quizzes = await this.prisma.quiz.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questionCount: quiz._count.questions,
    }));
  }

  async findOne(id: string): Promise<QuizDetailDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: questionWithOrder },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    return {
      id: quiz.id,
      title: quiz.title,
      createdAt: quiz.createdAt,
      questions: quiz.questions.map(toQuestionResponse),
    };
  }

  async update(id: string, dto: CreateQuizDto): Promise<QuizDetailDto> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    // Editing is always allowed, even after respondents have taken this quiz — a
    // Submission stores its own score/answers as a frozen snapshot at submit time and
    // has no real FK to Question, so replacing the questions here never touches or
    // invalidates past results.
    await this.prisma.quiz.update({
      where: { id },
      data: {
        title: dto.title,
        questions: {
          deleteMany: {},
          create: dto.questions.map((question, index) => ({
            text: question.text,
            type: question.type,
            order: index,
            correctBoolean: question.correctBoolean,
            correctText: question.correctText,
            options: question.options,
            correctOptions: question.correctOptions,
          })),
        },
      },
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id } });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${id} not found`);
    }

    await this.prisma.quiz.delete({ where: { id } });
  }

  async createSubmission(quizId: string, dto: CreateSubmissionDto): Promise<SubmissionCreatedDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: questionWithOrder },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${quizId} not found`);
    }

    const score = quiz.questions.reduce((total, question) => {
      const answer = dto.answers.find((a) => a.questionId === question.id);
      return isAnswerCorrect(question, answer) ? total + 1 : total;
    }, 0);

    const submission = await this.prisma.submission.create({
      data: {
        quizId,
        respondentName: dto.respondentName,
        answers: dto.answers as unknown as Prisma.InputJsonValue,
        score,
      },
    });

    return { id: submission.id, score: submission.score ?? 0 };
  }

  async listSubmissions(quizId: string): Promise<SubmissionSummaryDto[]> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });

    if (!quiz) {
      throw new NotFoundException(`Quiz ${quizId} not found`);
    }

    const submissions = await this.prisma.submission.findMany({
      where: { quizId },
      orderBy: { submittedAt: 'desc' },
    });

    return submissions.map((submission) => ({
      id: submission.id,
      respondentName: submission.respondentName,
      submittedAt: submission.submittedAt,
      score: submission.score ?? 0,
    }));
  }
}
