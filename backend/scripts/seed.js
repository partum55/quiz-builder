import { config } from 'dotenv';
config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const quiz = await prisma.quiz.create({
  data: {
    title: 'Sample Quiz: World Capitals',
    questions: {
      create: [
        { text: 'Is Paris the capital of France?', type: 'BOOLEAN', order: 0, correctBoolean: true },
        { text: 'What is the capital of Japan?', type: 'INPUT', order: 1, correctText: 'Tokyo' },
        {
          text: 'Which of these are capital cities?',
          type: 'CHECKBOX',
          order: 2,
          options: ['Tokyo', 'Sydney', 'Berlin', 'Barcelona'],
          correctOptions: ['Tokyo', 'Berlin'],
        },
      ],
    },
  },
  include: { questions: true },
});

console.log(`Created "${quiz.title}" (${quiz.id}) with ${quiz.questions.length} questions.`);
await prisma.$disconnect();
