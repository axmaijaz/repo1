export class RpmMRType {
  id: number;
  name: string;

  rpmMRProblems: RpmMrProblem[];
}

export class RpmMrProblem {
  chronicCondition: number;
  chronicConditionId: number;
  description: string;
  id: number;
  rpmMRTypeId: number;
  rpmMRGoals: RpmMRGoals[];
}
export class RpmMRGoals {
  description: string;
  id: number;
  rpmMRProblemId: number;
  rpmMRInterventions: RpmMRInterventions[];
}
export class RpmMRInterventions {
  description: string;
  encounterStatement: string;
  id: number;
  patientInstruction: string;
  rpmMRGoalId: number;
  shortDescription: string;
  status: any;
}
