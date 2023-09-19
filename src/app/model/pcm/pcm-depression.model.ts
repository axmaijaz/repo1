export class DepressionScreeningDto {
  id: number;
  auditScore: number;
  consumptionScore: number;
  dependenceScore: number;
  scoreResult: string;
  totalScore: number;
  note: string;

  signature: string;
  signatureDate: Date | string | null;
  alcoholMisuseId: number;

  depressionScreeningDetails = new Array<DepressionScreeningDetailDto>();
}

export class DepressionScreeningDetailDto {
  id: number;

  depressionScreeningQuestionId: number;
  // depressionScreeningQuestion: DepressionScreeningQuestion;
  question: string;
  order: number;
  isAuditQuestion: boolean;
  isConsumptionQuestion: boolean;
  isDependenceQuestion: boolean;

  selectedOptionScore: number | null;

  options = new Array<DepressionScreeningQuestionOptionDto>();

  depressionScreeningId: number;
}

export class DepressionScreeningQuestionOptionDto {
  id: number;
  text: string;
  score: number;

  depressionScreeningQuestionId: number;
}

export class EditDepressionScreeningDto {
  id: number;
  scoreResult: string;
  totalScore: number;
  note: string;

  depressionScreeningDetails = new Array<EditDepressionScreeningDetailDto>();
}

export class EditDepressionScreeningDetailDto {
  id: number;

  depressionScreeningQuestionId: number;

  selectedOptionScore: number | null;
}
