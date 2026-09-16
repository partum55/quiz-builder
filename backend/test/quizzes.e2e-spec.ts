import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

describe('Quizzes (e2e)', () => {
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
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await app.close();
  });

  it('creates, lists, fetches, and deletes a quiz with mixed question types', async () => {
    const createRes = await request(app.getHttpServer())
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

    const quizId = createRes.body.id;
    expect(createRes.body.questions.map((q: { order: number }) => q.order)).toEqual([0, 1, 2]);
    expect(createRes.body.questions[2].options).toEqual(['Red', 'Green', 'Blue']);

    const listRes = await request(app.getHttpServer()).get('/quizzes').expect(200);
    expect(listRes.body).toEqual([
      expect.objectContaining({ id: quizId, title: 'Mixed Quiz', questionCount: 3 }),
    ]);

    const getRes = await request(app.getHttpServer()).get(`/quizzes/${quizId}`).expect(200);
    expect(getRes.body.questions.map((q: { order: number }) => q.order)).toEqual([0, 1, 2]);

    await request(app.getHttpServer()).delete(`/quizzes/${quizId}`).expect(204);
    await request(app.getHttpServer()).get(`/quizzes/${quizId}`).expect(404);
  });

  it('returns 404 deleting a quiz that does not exist', () => {
    return request(app.getHttpServer()).delete('/quizzes/does-not-exist').expect(404);
  });

  it('rejects a CHECKBOX question whose correctOptions is not a subset of options', () => {
    return request(app.getHttpServer())
      .post('/quizzes')
      .send({
        title: 'Bad Quiz',
        questions: [
          {
            type: 'CHECKBOX',
            text: 'Pick primary colors',
            options: ['Red', 'Green', 'Blue'],
            correctOptions: ['Purple'],
          },
        ],
      })
      .expect(400);
  });
});
