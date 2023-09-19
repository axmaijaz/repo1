/// Warning : Should only be used in setup Mr Data
export class MRProblemSetupDto {
  id: number;

  description: string;

  mrTypeId: number;
  chronicConditionId: number | null;
}
/// Warning : Should only be used in setup Mr Data
export class MRGoalSetupDto {
  id: number;

  description: string;

  mrProblemId: number;

  rpmMRProblemId: number;
}

/// Warning : Should only be used in setup Mr Data
export class MRInterventionSetupDto {
  id: number;

  description: string;

  patientInstruction: string;
  shortDescription: string;
  encounterStatement: string;

  mrGoalId: number;
}

/// Warning : Should only be used in setup Mr Data
export class AssessmentTypeSetupDto {
  id: number;
  name: string;
}
export class AssessmentProblemSetupDto {
  id: number;

  description: string;

  assessmentTypeId: number;
  assessmentType: number;
  chronicConditionId: number | null;
}

/// Warning : Should only be used in setup Mr Data
export class AssessmentQuestionSetupDto {
  id: number;
  question: string;
  questionType: AssessmentQuestionType;
  questionOrder: number;
  yesComment: string;
  noComment: string;
  assessmentProblemId: number;
}
export enum AssessmentQuestionType {
  Text = 0,
  YesNo = 1,
  YesNoComment = 2,
}
