export enum MRInterventionStatus {
  'Not Started' = 0,				// 4
  Active = 1,					// 5
  Completed = 2,				// 0
  // 'Not Completed' = 3,			// 1 Moved to active
  // 'Partially Completed' = 4,		// 2 Moved to active
  // Discontinued = 5,			// 3  Moved to Not Applicable
  'Not Applicable' = 6
}
export enum MRGoalStatus {
  'Not Met' = 0,
  Met = 1,
  'Partially Met' = 2,
  Discontinued = 3
}
export enum MRProblemStatus {
  'Not Started' = 0,
  'Un Resolved' = 1,
  Resolved = 2,
  'Partially Resolved' = 3,
  'Not Applicable' = 4,
  Refused = 5
}
