import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('Submissions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.submission.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await app.close();
  });

  async function createMixedQuiz() {
    const res = await request(app.getHttpServer())
      .post('/quizzes')
      .send({
        title: 'Mixed Quiz',
        questions: [
          { type: 'BOOLEAN', text: 'Is the sky blue?', correctBoolean: true },
          { type: 'INPUT', text: 'Capital of France?', correctText: 'Paris' },
          {
            type: 'CHECKBOX',
            text: 'Pick primary colors',
            options: ['Red', 'Green', 'Blue'],
            correctOptions: ['Red', 'Blue'],
          },
        ],
      })
      .expect(201);
    return res.body as { id: string; questions: { id: string; type: string }[] };
  }

  it('accepts a submission, scores it against the correct answers, and lists it', async () => {
    const quiz = await createMixedQuiz();
    const [bool, input, checkbox] = quiz.questions;

    const submitRes = await request(app.getHttpServer())
      .post(`/quizzes/${quiz.id}/submissions`)
      .send({
        respondentName: 'Ada Lovelace',
        answers: [
          { questionId: bool.id, booleanValue: true }, // correct
          { questionId: input.id, textValue: '  paris  ' }, // correct (trimmed, case-insensitive)
          { questionId: checkbox.id, selectedOptions: ['Red', 'Green'] }, // incorrect
        ],
      })
      .expect(201);
    expect(submitRes.body.id).toBeTypeOf('string');
    expect(submitRes.body.score).toBe(2);

    const stored = await prisma.submission.findUniqueOrThrow({ where: { id: submitRes.body.id } });
    expect(stored.score).toBe(2);
    expect(stored.respondentName).toBe('Ada Lovelace');

    const listRes = await request(app.getHttpServer()).get(`/quizzes/${quiz.id}/submissions`).expect(200);
    expect(listRes.body).toEqual([
      expect.objectContaining({ id: submitRes.body.id, respondentName: 'Ada Lovelace', score: 2 }),
    ]);
  });

  it('returns 404 submitting to a quiz that does not exist', () => {
    return request(app.getHttpServer())
      .post('/quizzes/does-not-exist/submissions')
      .send({ respondentName: 'Grace Hopper', answers: [] })
      .expect(404);
  });

  it('returns 404 listing submissions for a quiz that does not exist', () => {
    return request(app.getHttpServer()).get('/quizzes/does-not-exist/submissions').expect(404);
  });

  it('rejects a submission with a blank respondent name', async () => {
    const quiz = await createMixedQuiz();
    return request(app.getHttpServer())
      .post(`/quizzes/${quiz.id}/submissions`)
      .send({ respondentName: '   ', answers: [] })
      .expect(400);
  });
});
