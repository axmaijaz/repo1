import {
  MRInterventionStatus,
  MRGoalStatus,
  MRProblemStatus,
} from "./mReview.enum";
import { CcmEncounterForList, CcmEncounterListDto } from '../admin/ccm.model';
import { PatientDto } from "../Patient/patient.model";

export class MRType {
  id: number;
  name: string;

  mrPatientProblems: MRProblem[];
}

export class MRProblem {
  id: number;
  description: string;
  status: MRProblemStatus;
  mrTypeId: number;
  chronicConditionId: number;
  monthlyReviewId: number;
  mrPatientGoals = new Array<MRGoal>();
  mrPatientQuestions = new Array<MRPatientQuestionDto>();
  active = false;
}

export class MRGoal {
  id: number;

  description: string;
  status: MRGoalStatus;

  goalDate: Date | string;

  mrPatientProblemId: number;
  monthlyReviewId: number;
  mrPatientInterventions = new Array<MRIntervention>();
}

export class MRIntervention {
  id: number;

  description: string;
  status: MRInterventionStatus;

  note: string;
  shortDescription: string;
  encounterStatement: string;
  interventionDate: Date | string;
  patientInstruction: string;

  mrPatientGoalId: number;
  monthlyReviewId: number;
}

export class MRPatientQuestionDto {
  id: number;
  question: string;
  questionType: MRQuestionType;
  questionOrder: number;
  answer: string;
  comment: string;

  mrPatientProblemId: number;
  monthlyReviewId: number;
}
export class EditAssessmentPatientQuestionDto {
  id = 0;
  answer: string;
  comment: string;
}

export enum MRQuestionType {
  Text = 0,
  YesNo = 1,
  YesNoComment = 2,
}
export class AssessmentPatientTypeDto {
  id: number;
  name: string;

  assessmentPatientProblems: AssessmentPatientProblemDto[];
}
export enum AssessmentProblemStatus {
  ProblemStatus1,
  ProblemStatus2,
  ProblemStatus3,
}

export class AssessmentPatientProblemDto {
  id: number;
  description: string;
  status: AssessmentProblemStatus;

  assessmentTypeId: number;

  chronicConditionId: number | null;
  assessmentPatientQuestions: AssessmentPatientQuestionDto[];
  monthlyReviewId: number;
}

export class AssessmentPatientQuestionDto {
  id: number;
  question: string;
  questionType: AssessmentQuestionType;
  questionOrder: number;
  yesComment: string;
  noComment: string;
  answer: string;
  comment: string;
  assessed: boolean;
  lastAssessmentDate?: Date | string;
  assessmentPatientProblemId: number;
  monthlyReviewId: number;
}

export enum AssessmentQuestionType {
  Text = 0,
  YesNo = 1,
  YesNoComment = 2,
}

export class MonthlyReviewDataDto {
  ccmTimeCompleted : string;
  assessments: AssessmentPatientTypeDto[];
  interventions: MRType[];
  ccmEncounters: CcmEncounterListDto[];
  patient: PatientDto;
}
