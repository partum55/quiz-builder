import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MAX_NAME_LENGTH } from './limits.js';

export class AnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  textValue?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedOptions?: string[];
}

export class CreateSubmissionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'respondentName must not be whitespace only' })
  @MaxLength(MAX_NAME_LENGTH)
  respondentName!: string;

  @ApiProperty({ type: [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers!: AnswerDto[];
}
