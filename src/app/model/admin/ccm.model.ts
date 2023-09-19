import { UploadFile } from "ng-uikit-pro-standard";
import { CcmMonthlyStatus } from "src/app/Enums/filterPatient.enum";

export class AddCcmEncounterDto {
  id: number;
  startTime: Date;
  endTime: Date;
  encounterDate: Date;
  note: string;
  ccmServiceTypeId: number;
  patientId: number;
  careProviderId: number
  isMonthlyStatusValid = false;
  ccmMonthlyStatus: number
  patientCommunicationIds: number[] = []
}


export class CcmEncounterListDto {
  id: number;
  startTime: string;
  endTime: string;
  duration: string;
  encounterDate: string;
  claimGenerated: boolean;
  note: string;
  ccmServiceTypeId: number;
  ccmServiceType: string;
  careProvider: string;
  careProviderId: number;
  careProviderName: string;
  qualityChecked: boolean;
  qualityCheckedByName: string;
  qualityCheckedDate: string;
}
export class CCMValidityStatusDto {
  activeInterventions: number;
  assessedQuestions: number;
  carePlanDate: string;
  monthDiff: number;
}

export interface CcmEncounterForList {
  consentDate: string;
  followUpDate: string;
  ccmTimeCompleted: string;
  ccmEncountersList: CcmEncounterListDto[];
  durationInNumber: number;
}

export class Language {
  id = 0;
  code = "";
  name = "";
}

export class CCMServiceSummaryDto {
  facilityUserId = 0;
  facilityId = 0;
  careProviderId = 0;
  month: number;
  year: number;
}
export class MinutesCCMServiceParam {
  // facilityUserId = 0;
  facilityId = 0;
  month = new Date().getMonth() + 1;
  year = new Date().getFullYear();
}
// export class CCMServiceResponseDto {
//   totalMinutes = 0;
//   totalPatients = 0;
//   summaryData =
// }
export class ServiceSummaryData {
  date = "";
  minutesCount = 0;
  patientsCount = 0;
}
export class ChangeMonthlyCcmStatus {
  ccmMonthlyStatus = 0;
  PatientId = 0;
}
export class RpmStatusChangeDto {
  newStatusValue = 0;
  patientId = 0;
  appUserId = "";
}
export interface PatientCarePlanApprovalDto {
  currentApprovalId: number;
  patientId: number;
  isLoading: boolean;

  patientName: string;

  firstApprovalDate: string;

  currentApprovalStatus: string;
  currentApprovalUpdatedOn: string;
  lastApprovedDate: string;
}
export class CcmDailyProgressParamsDto {
  facilityId = 0;
  facilityUserId = 0;
  startDate = "";
  endDate = "";
}

export class CCMMonthlyDataParamsDto {
  monthId: number;
  yearId: number;
  facilityId: number;
  status: CcmMonthlyStatus | number = -1;
  careCoordinatorId: number = 0;
  careFacilitatorId: number = 0;
}
export enum CcmEncounterTimeEnum {
  All = 0,
  "CCM Time 1-9" = 1,
  "CCM Time 10-19" = 2,
  "CCM Time 20-29" = 3,
  "CCM Time 30-39" = 4,
  "CCM Time 40-49" = 5,
  "CCM Time 50-59" = 6,
  "CCM Time 60-Above" = 7,
}
export class CCMMonthlyDataResponseDto {
  activePatientsCount: number;
  completedPatientsCount: number;
  eligiblePatientsCount: number;
  inEligiblePatientsCount: number;
  declinedPatientsCount: number;
  defferedPatientsCount: number;
  msNotStartedCount: number;
  msIncompleteCount: number;
  msContactedCount: number;
  msUnAnsweredCount: number;
  ccmTime_0: number;
  ccmTime_1_9: number;
  ccmTime_10_19: number;
  ccmTime_20_29: number;
  ccmTime_30_39: number;
  ccmTime_40_49: number;
  ccmTime_50_59: number;
  ccmTime_20_plus: number;
  ccmTime_40_plus: number;
  ccmTime_60_plus: number;
  ccmTime_20_plus_plus: number;
}
export class FinancialFormSendToPatientDto {
  patientId: number;
  documentLink: string;
  documentTitle: string;
  email: string;
  phoneNo: string;
  countryCallingCode= 1;
}
export class CcmStatusHistoryDto {
  id: number;
  status: number;
  updatedBy: string;
  updatedDateTime: string;
  reason: string;
}
export class CCMQualityCheckMOdalDto{
  patientId: number;
  isPrDashboard= false;
}
