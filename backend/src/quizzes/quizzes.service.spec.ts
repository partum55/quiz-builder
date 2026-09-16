import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { QuestionType } from '@prisma/client';
import { QuizzesService } from './quizzes.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateQuizDto } from './dto/create-quiz.dto.js';

describe('QuizzesService', () => {
  let service: QuizzesService;
  let prisma: {
    quiz: {
      create: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      delete: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(async () => {
    prisma = {
      quiz: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        delete: vi.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(QuizzesService);
  });

  describe('create', () => {
    it('assigns order from array index and returns the created quiz via findOne', async () => {
      const dto: CreateQuizDto = {
        title: 'Geography',
        questions: [
          { type: QuestionType.BOOLEAN, text: 'Is Earth round?', correctBoolean: true },
          { type: QuestionType.INPUT, text: 'Capital of France?', correctText: 'Paris' },
        ],
      };

      prisma.quiz.create.mockResolvedValue({ id: 'quiz-1' });
      prisma.quiz.findUnique.mockResolvedValue({
        id: 'quiz-1',
        title: 'Geography',
        createdAt: new Date('2026-01-01'),
        questions: [
          {
            id: 'q1',
            text: 'Is Earth round?',
            type: QuestionType.BOOLEAN,
            order: 0,
            correctBoolean: true,
            correctText: null,
            options: null,
            correctOptions: null,
          },
          {
            id: 'q2',
            text: 'Capital of France?',
            type: QuestionType.INPUT,
            order: 1,
            correctBoolean: null,
            correctText: 'Paris',
            options: null,
            correctOptions: null,
          },
        ],
      });

      const result = await service.create(dto);

      expect(prisma.quiz.create).toHaveBeenCalledWith({
        data: {
          title: 'Geography',
          questions: {
            create: [
              expect.objectContaining({ order: 0, type: QuestionType.BOOLEAN }),
              expect.objectContaining({ order: 1, type: QuestionType.INPUT }),
            ],
          },
        },
      });
      expect(result.id).toBe('quiz-1');
      expect(result.questions).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('maps quizzes to summaries with question counts', async () => {
      prisma.quiz.findMany.mockResolvedValue([
        { id: 'quiz-1', title: 'Geography', createdAt: new Date(), _count: { questions: 3 } },
      ]);

      const result = await service.findAll();

      expect(result).toEqual([
        expect.objectContaining({ id: 'quiz-1', title: 'Geography', questionCount: 3 }),
      ]);
    });
  });

  describe('findOne', () => {
    it('throws NotFoundException when the quiz does not exist', async () => {
      prisma.quiz.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when the quiz does not exist', async () => {
      prisma.quiz.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.quiz.delete).not.toHaveBeenCalled();
    });

    it('deletes the quiz when it exists', async () => {
      prisma.quiz.findUnique.mockResolvedValue({ id: 'quiz-1' });
      prisma.quiz.delete.mockResolvedValue({ id: 'quiz-1' });

      await service.remove('quiz-1');

      expect(prisma.quiz.delete).toHaveBeenCalledWith({ where: { id: 'quiz-1' } });
    });
  });
});
