import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { QuestionType } from '@prisma/client';
import { QuestionDto } from './question.dto.js';
import { MAX_OPTIONS_PER_QUESTION, MAX_TEXT_LENGTH } from './limits.js';

async function errorsFor(payload: Record<string, unknown>) {
  const dto = plainToInstance(QuestionDto, payload);
  return validate(dto);
}

describe('QuestionDto shape validation', () => {
  it('accepts a valid BOOLEAN question', async () => {
    const errors = await errorsFor({
      type: QuestionType.BOOLEAN,
      text: 'Is the sky blue?',
      correctBoolean: true,
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects a BOOLEAN question with correctText set', async () => {
    const errors = await errorsFor({
      type: QuestionType.BOOLEAN,
      text: 'Is the sky blue?',
      correctBoolean: true,
      correctText: 'yes',
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects an INPUT question with whitespace-only correctText', async () => {
    const errors = await errorsFor({
      type: QuestionType.INPUT,
      text: 'Capital of France?',
      correctText: '   ',
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('accepts a valid CHECKBOX question', async () => {
    const errors = await errorsFor({
      type: QuestionType.CHECKBOX,
      text: 'Pick primary colors',
      options: ['Red', 'Green', 'Blue'],
      correctOptions: ['Red', 'Blue'],
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects CHECKBOX when correctOptions is not a subset of options', async () => {
    const errors = await errorsFor({
      type: QuestionType.CHECKBOX,
      text: 'Pick primary colors',
      options: ['Red', 'Green', 'Blue'],
      correctOptions: ['Purple'],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects CHECKBOX with duplicate options', async () => {
    const errors = await errorsFor({
      type: QuestionType.CHECKBOX,
      text: 'Pick primary colors',
      options: ['Red', 'Red'],
      correctOptions: ['Red'],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it(`rejects question text longer than ${MAX_TEXT_LENGTH} characters`, async () => {
    const errors = await errorsFor({
      type: QuestionType.BOOLEAN,
      text: 'x'.repeat(MAX_TEXT_LENGTH + 1),
      correctBoolean: true,
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it(`accepts question text at exactly ${MAX_TEXT_LENGTH} characters`, async () => {
    const errors = await errorsFor({
      type: QuestionType.BOOLEAN,
      text: 'x'.repeat(MAX_TEXT_LENGTH),
      correctBoolean: true,
    });
    expect(errors).toHaveLength(0);
  });

  it(`rejects CHECKBOX with more than ${MAX_OPTIONS_PER_QUESTION} options`, async () => {
    const options = Array.from({ length: MAX_OPTIONS_PER_QUESTION + 1 }, (_, i) => `Option ${i}`);
    const errors = await errorsFor({
      type: QuestionType.CHECKBOX,
      text: 'Too many options',
      options,
      correctOptions: [options[0]],
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it(`accepts CHECKBOX with exactly ${MAX_OPTIONS_PER_QUESTION} options`, async () => {
    const options = Array.from({ length: MAX_OPTIONS_PER_QUESTION }, (_, i) => `Option ${i}`);
    const errors = await errorsFor({
      type: QuestionType.CHECKBOX,
      text: 'Exactly at the limit',
      options,
      correctOptions: [options[0]],
    });
    expect(errors).toHaveLength(0);
  });
});
