import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '@prisma/client';
import { MAX_OPTIONS_PER_QUESTION, MAX_TEXT_LENGTH } from './limits.js';

@ValidatorConstraint({ name: 'questionShape', async: false })
class QuestionShapeConstraint implements ValidatorConstraintInterface {
  private message = '';

  validate(_type: QuestionType, args: ValidationArguments) {
    const dto = args.object as QuestionDto;

    switch (dto.type) {
      case QuestionType.BOOLEAN:
        if (dto.correctText !== undefined || dto.options !== undefined || dto.correctOptions !== undefined) {
          this.message = 'BOOLEAN questions must only set correctBoolean';
          return false;
        }
        if (dto.correctBoolean === undefined) {
          this.message = 'BOOLEAN questions require correctBoolean';
          return false;
        }
        return true;

      case QuestionType.INPUT:
        if (dto.correctBoolean !== undefined || dto.options !== undefined || dto.correctOptions !== undefined) {
          this.message = 'INPUT questions must only set correctText';
          return false;
        }
        if (dto.correctText === undefined) {
          this.message = 'INPUT questions require correctText';
          return false;
        }
        return true;

      case QuestionType.CHECKBOX:
        if (dto.correctBoolean !== undefined || dto.correctText !== undefined) {
          this.message = 'CHECKBOX questions must only set options and correctOptions';
          return false;
        }
        if (dto.options === undefined || dto.correctOptions === undefined) {
          this.message = 'CHECKBOX questions require options and correctOptions';
          return false;
        }
        if (!dto.correctOptions.every((opt) => dto.options!.includes(opt))) {
          this.message = 'every correctOptions value must exist in options';
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  defaultMessage() {
    return this.message;
  }
}

export class QuestionDto {
  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  @Validate(QuestionShapeConstraint)
  type!: QuestionType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'text must not be whitespace only' })
  @MaxLength(MAX_TEXT_LENGTH)
  text!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  correctBoolean?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'correctText must not be whitespace only' })
  @MaxLength(MAX_TEXT_LENGTH)
  correctText?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(MAX_OPTIONS_PER_QUESTION)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(MAX_TEXT_LENGTH, { each: true })
  options?: string[];

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_OPTIONS_PER_QUESTION)
  @ArrayUnique()
  @IsString({ each: true })
  correctOptions?: string[];
}
