import {
  CareProviderAssignedEnum,
  PatientStatus,
  SortOrder,
} from "src/app/Enums/filterPatient.enum";

export class PRCMPatientsScreenParams {
  pageNumber = 1;
  searchParam = "";
  pageSize = 10;
  customListId = 0;
  diseaseId = 0;
  sortBy = "";
  showAll = false;
  sortOrder: SortOrder = 0;
  facilityId = 0;
  facilityUserId: number;
  patientStatus: PatientStatus = PatientStatus.Active;
  assigned: CareProviderAssignedEnum = CareProviderAssignedEnum.All;
  serviceMonth = new Date().getMonth() + 1;
  serviceYear = new Date().getFullYear();
  prCMStatus: PRCMStatusEnum = -1;
  prCMSpecialistBillerId: number = 0;
  prCMCareCoordinatorId: number = 0;
  prCMCareFacilitatorId: number = 0;

  dateAssignedFrom = "";
  dateAssignedTo = "";
  filteredMonth = '';
  section = '';
  duration: PRCMDuration = -1;

  // PRCM Dashboard
  dashboardDiseaseIds = ['0'];
  dashboardConditionsIds = ['0'];
  payerIds: number[] = [];
  encounterDateFrom = '';
  encounterDateTo = '';
  age = '0';
}
export enum PRCMDuration {
NA = -1,
Mins1_9 = 0,
Mins10_19 = 1,
Mins20_29 = 2,
Mins30 = 3,
}
export class PrcmStatusDto {
  patientId = 0;
  prCMStatus: number;
}
export class PRCMDashboardFilter {
  facilityId = 0;
  careProviderId = 0;
  billingProviderId = 0;
  careFacilitatorId = 0;
  PRCMStatus = -1;
}

export class EditPRCMData {
  patientId: number;
  prCMSpecialistBillerId: number;
  prCMCareFacilitatorId: number;
  prCMCareCoordinatorId: number[] = [];
  chronicIcd10Code: any | string[] = [];
  prCMStatus: PRCMStatusEnum;
}
export enum PRCMStatusEnum {
  InActive = 0,
  Active = 1,
}
export enum End_PrCMServiceType {
  'Initial Assessment' = 0,
  'PCM Assessment' = 1,
  Help = 2,
  Appointment = 3,
  'Medication Refill' = 4,
  Education = 5,
  'Community Resources' = 6,
  'Urgent Visit/ED' = 7,
  'Symptom Exacerbation' = 8


}

export class PRCMEncounterDto {
  id = 0;
  startTime: string;
  endTime: string;
  encounterDate: Date | string;
  note = '';
  cptCode = "G2065";
  prCMServiceTypeId = 1;
  patientId: number;
  end_PrCMSpecialistBillerId: number;
  end_PrCMCareFacilitatorId: number | null;
  prCMCareCoordinatorId: number | null;
}
export interface PagingData {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  elementsCount: number;
}

export class ChronicDisease {
  code: string;
  detail: string;
}

export class PRCMPatientsListDto {
  id: number;
  patientEmrId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  prCMStatus: number;
  dateAssigned: string;
  dateOfBirth: string;
  end_PrCMCareFacilitatorId?: number;
  end_PrCMCareFacilitatorName?: string;
  end_PrCMCareFacilitatorAbbreviation?: string;
  end_PrCMSpecialistBillerId?: number;
  end_PrCMSpecialistBillerName?: string;
  end_PrCMSpecialistBillerAbbreviation?: string;
  chronicDiseases: ChronicDisease[];
  careCoordinators: PrCMCareCoordinatorForDisplay[];
  currentMonthCompletedTime: number;
  currentMonthCompletedTimeString: string;
  facilityId: number;
  isPrCMRevoked: boolean;
  isCCMRevoked: boolean;
  isRPMRevoked: boolean;
  isDeletedState: boolean;

  bmi = new GapHeaderModel();
  a1C = new GapHeaderModel();
  dn = new GapHeaderModel();
  ld = new GapHeaderModel();
  de = new GapHeaderModel();
}
export class GapHeaderModel {
  lastReadingDate: Date | string | null;
  value: string;
  valueInNumber: number;
  NoOfMonth: number;
}
export class PrCMEncounterForListDto {
  id = 0;
  startTime: string;
  endTime: string;
  duration = "";
  encounterDate: string;
  note: string;
  cptCode: string;
  end_PrCMServiceType: number;
  claimGenerated: boolean;
  end_PrCMCareFacilitatorId: number | null;
  end_PrCMCareFacilitatorName: string;
  end_PrCMSpecialistBillerId: number | null;
  end_PrCMSpecialistBillerName: string;
  prCMCareCoordinatorId: number;
  prCMCareCoordinatorName: string;
  patientId: number;
}
export class PrCMCareCoordinatorForDisplay {
  careCoordinatorId: number;
  fullName: string;
  nameAbbreviation: string;
}

export class CodeDetailModel {
  code = "";
  detail = "";
}
export class PRCMUploadDocDto {
  title: string;
  note: string;
  dateCreated: string | Date;
}
export class DocListDto {
  id: number;
  title: string;
  path: string;
  dateCreated: string | Date;
  note: string;
  patientId: number;
}
export class PRCMEncountersListDto {
  id: number;
  startTime: string;
  endTime: string;
  duration: string;
  encounterDate: string;
  note: string;
  PRCMServiceType: number;
  claimGenerated: boolean;
  PRCMCareManagerId: number;
  PRCMCareManagerName: string;
  psychiatristId: number;
  cptCode: string;
  psychiatristName: string;
  patientId: number;
  gPRCMPsychiatrist = "";
}

// export class PrcmDiagnosisDto {
//   id: number;
//   practiceId: string;
//   practiceName: string;
//   encounterId: string;
//   encounterTimestamp: Date | string;
//   icdCode: string;
//   icdCodeSystem: string;
//   diagnosisCodeId: string;
//   description: string;
//   diagnosisDate: Date | string | null;
//   resolvedDate: Date | string | null;
//   isChronic: boolean;
//   isPrCMDiagnose: boolean;
//   note: string;

//   patientId: number;
//   patientName: string;
// }
export class PrcmDiagnosisDto {
  id: number;
  chronicConditionId: number;
  icdCode: string;
  detail: string;
  algorithm: string;
  isPrCMDiagnose: boolean;
}

export class PRCMDashboardParamsDto {
  filteredMonth: Date | string;
  facilityId: number;
  careCoordinatorId: number;
  careFacilitatorId: number;
}

export class PRCMDashboardDataDto {
  activePatients: number;
  notStartedPatients: number;
  section_One = new PRCMDashboardSection();
  greaterThirtyCount: number;

}
export class PRCMDashboardSection {
  totalCount: number;
  subCountOne: number;
  subCountTwo: number;
  subCountThree: number;
}

export class PatientsPRCMDataDto {
        end_PrCMSpecialistBillerId: number | null;
        end_PrCMCareFacilitatorId: number | null;
    }

    export class BulkDateAssignedParamDto {
        patientIds = new Array<number>();
        dateAssigned: Date | string | null;
        facilityId: number;
    }
