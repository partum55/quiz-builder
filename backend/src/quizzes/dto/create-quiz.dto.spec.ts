import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateQuizDto } from './create-quiz.dto.js';
import { MAX_QUESTIONS_PER_QUIZ, MAX_TEXT_LENGTH } from './limits.js';

function question(text = 'Question?') {
  return { type: 'BOOLEAN', text, correctBoolean: true };
}

async function errorsFor(payload: Record<string, unknown>) {
  const dto = plainToInstance(CreateQuizDto, payload);
  return validate(dto);
}

describe('CreateQuizDto limits', () => {
  it(`rejects a title longer than ${MAX_TEXT_LENGTH} characters`, async () => {
    const errors = await errorsFor({ title: 'x'.repeat(MAX_TEXT_LENGTH + 1), questions: [question()] });
    expect(errors.length).toBeGreaterThan(0);
  });

  it(`accepts a title at exactly ${MAX_TEXT_LENGTH} characters`, async () => {
    const errors = await errorsFor({ title: 'x'.repeat(MAX_TEXT_LENGTH), questions: [question()] });
    expect(errors).toHaveLength(0);
  });

  it(`rejects more than ${MAX_QUESTIONS_PER_QUIZ} questions`, async () => {
    const questions = Array.from({ length: MAX_QUESTIONS_PER_QUIZ + 1 }, () => question());
    const errors = await errorsFor({ title: 'Too many questions', questions });
    expect(errors.length).toBeGreaterThan(0);
  });

  it(`accepts exactly ${MAX_QUESTIONS_PER_QUIZ} questions`, async () => {
    const questions = Array.from({ length: MAX_QUESTIONS_PER_QUIZ }, () => question());
    const errors = await errorsFor({ title: 'Exactly at the limit', questions });
    expect(errors).toHaveLength(0);
  });
});
