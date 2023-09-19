import { SortOrder } from "src/app/Enums/filterPatient.enum";
import { BhiEncounterTimeEnum, BhiStatusEnum } from "src/app/Enums/bhi.enum";

export class SectionEqual30 {
  totalCount: number;
  count_1_9: number;
  count_10_19: number;
  count_20_29: number;
}

export class SectionAbove30 {
  totalCount: number;
  count_30_39: number;
  count_40_49: number;
  count_50_59: number;
}

export class BhiDashboardDto {
  activePatients: number;
  notStartedTimePatients: number;
  type: string;
  count_1_9: number;
  count_10_19: number;
  count_20_29: number;
  count_30_39: number;
  count_40_49: number;
  count_50_59: number;
  count_20_39: number;
  count_40_plus: number;
  count_30_59: number;
  count_60_plus: number;
}
export class AssignDateToMultiplePatientsDto {
  patientIds = new Array<number>();
  // careProviderIdsToAssign = new Array<number>();
  // careProviderIdsToRemove = new Array<number>();
  // careFacilitatorId = 0;
  dateAssigned = '';
}
export class BhiPatientsScreenParams {
  pageNumber = 1;
  searchParam = "";
  pageSize = 10;
  customListId = 0;
  bhiStatus = BhiStatusEnum["Active PCM"];
  bhiCareManagerId = 0;
  PsychiatristId = 0;
  facilityId = 0;
  facilityUserId: number;
  serviceMonth = new Date().getMonth() + 1;
  serviceYear = new Date().getFullYear();
  diseaseId = 0;
  sortBy = "";
  showAll = false;
  sortOrder: SortOrder = 0;
  BhiEncounterTime: BhiEncounterTimeEnum[] = [BhiEncounterTimeEnum.All];

  conditionsIds= ['0'];
  chronicDiseasesIds: any = [''];
  Assigned = 0;
  bhiMonthlyStatus = [''];
  billingProviderId = 0;
  DateAssignedFrom = '';
  DateAssignedTo = '';
  // insurancePlanId = 0;
  // measureIds: number[] = [];
  // status: GapStatus = -1;
  // lastDoneFrom: Date | string | null = '';
  // lastDoneTo: Date | string | null = '';
  // nextDueFrom: Date | string | null = '';
  // nextDueTo: Date | string | null = '';
  // chronicConditionIds: number[] = [];
}

export class BhiDashboardFilter {
  facilityId = 0;
  careProviderId = 0;
  billingProviderId = 0;
  careFacilitatorId = 0;
  bhiStatus = -1;
}

export class EditBhiData {
  patientId = 0;
  bhiCareCoordinatorIds = new Array<number>();
  bhiCareManagerId = 0;
  bhiPsychiatristId = 0;
  gbhiPsychiatrist = "";
  bhiStatus = 0;
  billingProviderId: number;
}
export class BhiStatusDto {
  patientId = 0;
  bhiStatus: number;
}
export class BhiMonthlyStatusDto {
  patientId: 0;
  newStatusValue: 0;
  appUserId: string;
}
export class BhiEncounterDto {
  id = 0;
  startTime: string;
  endTime: string;
  encounterDate: string;
  duration: string;
  note = "";
  bhiServiceTypeId = 0;
  patientId = 0;
  cptCode = "";
  bhiCareManagerId: number;
  psychiatristId: number;
  bhiCareCoordinatorId: number;
  gbhiPsychiatrist = "";
  isProviderEncounter = false;
  bhiMonthlyStatus = 4;
}
export class BhiPatientsListDto {
  isBHIRevoked: boolean;
  id: number;
  patientEmrId: string;
  profileStatus: boolean;
  checked: boolean;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  bhiMsQualityChecked: boolean;
  bhiStatus: BhiStatusEnum;
  bhiCareManagerId: number;
  bhiCareManagerName?: any;
  bhiCareManagerAbbreviation?: any;
  psychiatristId: number;
  psychiatristName?: any;
  psychiatristAbbreviation?: any;
  chronicDiseasesIds: number[];
  currentMonthCompletedTime: number;
  currentMonthCompletedTimeString: string;
  chronicDiseases = new Array<CodeDetailModel>();
  bhiCareCoordinators = new Array<BhiCoordinatorsDto>();
  facilityId: number;
  gbhiPsychiatrist = "";
  dateAssigned: string;
  billingProviderId: number;
}
export class BhiCoordinatorsDto {
  bhiCareCoordinatorId: number;
  fullName: string;
  nameAbbreviation: string;
}
export class CodeDetailModel {
  code = "";
  detail = "";
}
export class BHIUploadDocDto {
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
export class BhiEncountersListDto {
  id: number;
  startTime: string;
  endTime: string;
  duration: string;
  encounterDate: string;
  note: string;
  bhiServiceType: number;
  claimGenerated: boolean;
  bhiCareManagerId: number;
  bhiCareManagerName: string;
  bhiCareCoordinatorId: number;
  bhiCareCoordinatorName: string;
  psychiatristId: number;
  cptCode: string;
  psychiatristName: string;
  patientId: number;
  isProviderEncounter: boolean;
  gbhiPsychiatrist = "";
  bhiMonthlyStatus: number;
}
export enum BHIServiceTypeEnum {
  'Evaluation Counselling' = 0,
  'Initial Assessment' = 1
}