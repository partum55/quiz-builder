import { ApiProperty } from '@nestjs/swagger';

export class SubmissionCreatedDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  score!: number;
}

export class SubmissionSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  respondentName!: string;

  @ApiProperty()
  submittedAt!: Date;

  @ApiProperty()
  score!: number;
}
