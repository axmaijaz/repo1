export class AMScreeningDto {
  id = 0;
  auditScore: number;
  consumptionScore: number;
  dependenceScore: number;
  scoreResult: string;

  note: string;

  signature: string;
  signatureDate: Date | string | null;
  alcoholMisuseId: number;

  amScreeningDetails = new Array<AMScreeningDetailDto>();
}

export class AMScreeningDetailDto {
  id = 0;

  amScreeningQuestionId: number;
  // aMScreeningQuestion: AMScreeningQuestion;
  question: string;
  order: number;
  isAuditQuestion: boolean;
  isConsumptionQuestion: boolean;
  isDependenceQuestion: boolean;

  selectedOptionScore: number | null;

  options = new Array<AMScreeningQuestionOptionDto>();

  amScreeningId: number;
}

export class AMScreeningQuestionOptionDto {
  id = 0;
  text: string;
  score: number;

  amScreeningQuestionId: number;
}
export class EditAMScreeningDto {
  id = 0;
  auditScore: number;
  consumptionScore: number;
  dependenceScore: number;
  scoreResult: string;
  note: string;
  amScreeningDetails = new Array<EditAMScreeningDetailDto>();
}

export class EditAMScreeningDetailDto {
  id = 0;
  amScreeningQuestionId: number;
  selectedOptionScore: number | null;
}

export class EditAMCounsellingDto {
  id = 0;
  note: string;
  signature: string;
  signatureDate: Date;
  billingProviderId: number;
  alcoholMisuseId: number;
}
