export class CCMEodReportGraph {
  achievements = 0;
  eligiblePatients = 0;
  facilityId: number;
  facilityName: string;
  lastMonthAchievements = 0;
  ccmProjection = 0;
  todayGoal = 0;
}

export class CCMEodReport {
  eligiblePatients: number;
  totalAddedPatients: number;
  totalContactedPatients: number;
  totalCompletedPatients: number;
  notAnsweredPatients: number;
  declinedPatients: number;
  defferedPatients: number;
  hHCDefferedPatients: number;
  completedPercentage: number;
  facilityName: string;
  facilityId: number;
  changedProviderPatients: number;
  deadPatients: number;
  totalActivePatients: number;
}
export class RPMEodReportGraph {
  facilityId: number;
  facilityName: string;
  activePatients = 0;
  noReadingPatients = 0;
  sixteenDaysReadingPatients = 0;
  totalCompletedPatients = 0;
  rpmProjection = 0;
}

export class RPMEodReport {
  eligiblePatients: number;
  totalAddedPatients: number;
  totalContactedPatients: number;
  totalCompletedPatients: number;
  notAnsweredPatients: number;
  declinedPatients: number;
  defferedPatients: number;
  hHCDefferedPatients: number;
  completedPercentage: number;
  facilityName: string;
}
export class MonthlyProjection {
  id: number;
  facilityId: number;
  ccmTarget = 0;
  rpmTarget = 0;
  facilityName: string;
}
export class EditMonthlyProjection {
  id: number;
  ccmTarget: number;
  rpmTarget: number;
  month: number;
  year: number;
}
export class EodMonthlyReport {
  ccmCompletedPatientsCount: number;
  declinedCount: number;
  month: string;
  notAnsweredCount: number;
  rpmActivePatientsCount: number;
  rpmCompletedPatientsCount: number;
  rpmReadingCompletedCount: number;
}
