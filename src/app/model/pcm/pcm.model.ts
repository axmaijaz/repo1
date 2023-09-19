import { id } from '@swimlane/ngx-datatable';
import { PatientStatus } from './../../Enums/filterPatient.enum';
import { SortOrder } from "src/app/Enums/filterPatient.enum";
import { CareProvidersListDto } from '../Patient/patient.model';
import { PCMMeasureInfoDropdownResultValue, PCMMeasureInfoResultType, ScheduleFlag } from 'src/app/Enums/pcm.enum';

export class PcmMeasureReference {
  id: number;
  reference: string;
  pcmMeasureInfoId: number;
}

export class Status {
  name: string;
  value: number;
}
export class PcmMeasureDataObj {
  id = 0;
  lastDone?: Date | string | null;;
  nextDue?= '';
  result?= '';
  note?= '';
  guideline = '';
  measureName = '';
  code?= '';
  whoIsCovered = '';
  updatedOn: Date | string | null;
  updatedUser = '';
  qualityChecked: boolean;
  frequency = '';
  controlled: boolean;
  hasEncounters: boolean;
  currentStatus: number;
  pcmDocuments: PcmDocData[];
  pcmMeasureReferences: PcmMeasureReference[];
  statusList: Status[];
  patientId: number;
  isResultNumeric: boolean;
  pcmMeasureDropdownResultValues: any;

  pcmMeasureInfoResultType: PCMMeasureInfoResultType;
  insuranceGapFlags: InsuranceGapFlagListDto[];
  pcmMeasureInfoDropdownResultValue: PCMMeasureInfoDropdownResultValue;

   //For CareGap Schedule
   scheduleFlag: number = 0;
   eventDate: Date | string;
   scheduleNote: string;

  //  scheduleFlag: ScheduleFlag;
  //       eventDate: Date | string;
  //       scheduleNote: string;
        scheduleUpdatedOn: Date | string;
        scheduleUpdatedUser: string;
}
export class InsuranceGapFlagListDto {
        id: number;
        name: string;
        checked: boolean;
        pcmMeasureInfoFlagId: number;
    }
export class PCMeasureDataListDto
    {
        colorectalCancerScreening = new PcmMeasureDataObj();
        breastCancerScreening = new PcmMeasureDataObj();
        diabeticNephropathy = new PcmMeasureDataObj();
        diabeticEyeCare = new PcmMeasureDataObj();
        influenzaVaccine = new PcmMeasureDataObj();
        pneumococcalVaccine = new PcmMeasureDataObj();
    }
export enum GapStatus {
  'Not Started'  = 0,
  Eligible = 1,
  Refused = 2,
  'Up to Date' = 3,
  Due = 4,
  'Not Applicable' = 5,
}
export class PcmDocData {
  id = 0;
  title: string;
  path?: string;
}
export class MeasureDto {
  id = 0;
  measureName: string;
  code: string;
  hasAttachment: boolean;
  removeHeader: boolean;
  status: number;
  color: string;
  lastDone: Date | string | null;
  nextDue: Date | string | null;
  result: string;
  note: string;
  statusList: Status[];
  qualityChecked: boolean;
  updatedOn: Date | string | null;
  updatedUser: string;
  // add for pcm status screen
  isFacilityGap: boolean;
  insuranceGapId: number;
  isShowColumn = true;
  tempCheck: boolean;

  isMedicareGap: boolean;
  isPayerGap: boolean;
}

export class PcmMeasureDto {
      id = 0;
      patientEmrId: string;
      patientSchedulingNote: string;
      fullName: string;
      gapStatus: number;
      measureInfoList = new Array<MeasureDto>();
}
export class PcmAllGraphDto {
  id: number;
  code: string;
  measureName: string;
  covered: number;
  notCovered: number;
  notStarted: number;
  eligible: number;
  refused: number;
  uptoDate: number;
  due: number;
  notApplicable: number;
  isShowColumn = true;
  tempCheck: boolean;

  statusValue = new Array<number>();
  dataSet: any;
  // dataSet = new bubblechartDatasetDto();
  status = new Array<string>();
}
export class PCMeasureDataForGraphDto
	{
		gapsResult = new Array<PcmAllGraphDto>();
		patientsCount = 0;
		pcmPatientsCount = 0;
		coveredPercent = 0;

	}
export class bubblechartDatasetDto {
  data = new Array<number>();
  label = '';
}
export class MeasureInfoDto {
  id: number;
  measureName: string;
  code: string;
  guideline: string;
  isMedicareGap: boolean;
  isDefault: boolean;
  whoIsCovered: string;
  frequency: string;
  isShowColumn = true;
  tempCheck: boolean;


  // Is Result Prop in InsuranceGap string or not
  isResultNumeric: boolean;
}
export class EditMeasureDataParams {
  id: number;
  patientId: number;
  code: string;
  controlled: boolean;
  lastDone: Date | string | null;
  nextDue: Date | string | null;
  result: string;
  note: string;
  currentStatus: number;
  insuranceGapFlags: InsuranceGapFlagListDto[];

   //For CareGap Schedule
   careGapSchedule = new AddEditCareGapScheduleDto();
  //  scheduleFlag: ScheduleFlag;
  //  eventDate: Date | string;
  //  scheduleNote: string;
}
export class AddEditCareGapScheduleDto {
        scheduleFlag: number;
        eventDate: Date | string;
        scheduleNote: string;
}

export class DocDataDto {
  id = 0;
  preSignedUrl = '';
}

export class PCMEncounterDto {
  encounterId: number;
  awEncounterId: number;
  measureName: string;
  measureCode: string;
  encounterType: PcmEncounterType;
  cptCode: string;
  result: string;
  status: PcmEncounterStatus;
  note: string;
  encounterDate: Date | string | null;
  createdOn: Date | string;
  billingProvider: string;
  isBilled: boolean;
  addendumNote: string;
  addendumSignature: string;
}
export class PcmScreeningSignDto {
  screeningId: number;
  signature: string;
  signatureDate: Date | string;
}
export class AddendumNoteDto
    {
        awEncounterId: number;
        addendumNote: string;
        addendumSignature: string;
    }
export enum PcmEncounterStatus {
  None = 0,
  'In Process' = 1,
  Successfull = 2,
  'Closed Error' = 3,
  'Closed Duplicate' = 4,
  'Closed Other' = 5,
}
export class CloseEncounterDto {
  id = 0;
  measure: string;
  encounterType: PcmEncounterType;
  status: PcmEncounterStatus;
}

export enum PcmEncounterType {
  UnKnown = 0,
  'Annuall Wellness' = 1,
  Screening = 2,
  Counseling = 3,
}

export class EditDPCounsellingDto {
  id: number;
  note: string;
  signature: string;
  signatureDate: Date;
  billingProviderId: number;
  depressionMeasureId: number;
}

export class PreventiveGapScreenParams {
  pageNumber = 1;
  searchParam = '';
  customListId = 0;
  pageSize = 10;
  facilityId = 0;
  insurancePlanId: number;
  measureIds: number[] = [];
  status: GapStatus = -1;
  lastDoneFrom: Date | string | null = '';
  lastDoneTo: Date | string | null = '';
  nextDueFrom: Date | string | null = '';
  nextDueTo: Date | string | null = '';
  chronicConditionIds: number[] = [];
  careProviderId = 0;
  sortBy = "";
  sortOrder: SortOrder = 0;
  payerId = 0;
  // diseaseIds = new Array<number>();
  gapIds = new Array<number>();

  diseaseIds: any = ['0'];
  tempChronicDiseasesIds: any;
  conditionsIds = ['0'];
  insurance = '';
  ccmStatus = -1;
  // lastDoneTo = '';
  // lastDoneFrom = '';
  showAll = false;
  careCoordinatorId = 0;
  careFacilitatorId = 0;
  careManagerId = 0;
  facilityUserId = 0;
  billingProviderId = 0;
  patientStatus = 1;
  scheduleFlags = '';
  gapStatuses = '';
  includeGapDetails = false;
  communicationConsent = 0;
}

export class FacilityGapsListDto {
  pcmMeasureInfoId: number;
    name: string;
}

export class PreventiveGapScreenDto {
  checked: boolean;
  id: number;
  fullName: string;
  careProviders = new Array<CareProvidersListDto>();
  pcmStatus: number;
  dueGapsCount: number;
  chronicIcdCodes: string;
  careFacilitatorNameAbbreviation: string;
  insurancePlanName: string;
  careFacilitatorName: string;
  billingProviderName = '';
  billingProviderNameAbbreviation = '';
  billingProviderId: number;
  careFacilitatorId: number;
  ccmStatus: number;
  dob: Date | string | null;
  insurancePlan: string;
  measure: string;
  status: string;
  result: string;
  lastDone: Date | string | null;
  nextDue: Date | string | null;
  note: string;
  payer = '';
  careCoordinator = '';
  careFacilitator = '';
  billingProvider = '';
  gapId: number;
}

export class AddEditCounselingDto {
  id = 0;
  note: string;
  measureCode: string;
  cptCode: string;
  signature: string;
  signatureDate = '';
  billingProviderId = 0;
  awEncounterId = 0;
  patientId = 0;
}
export class PcmStatusDto {
    patientId = 0;
    pcmStatus: number;
}

export class CareGapsGraphDto {
  facilityId = 0;
  status = -1;
  careProviderId = 0;
  careFacilitatorId = 0;
  billingProviderId = 0;
  CareGaps = Array<number>();
}
// export const PcmMeasrues = [
//   { shortCode: 'AA', name: 'AAA Screening' },
//   { shortCode: 'AM', name: 'Alcohol Misuse Screening & Counseling' },
//   { shortCode: 'AW', name: 'Annual Wellness screen' },
//   { shortCode: 'BM', name: 'BM Measurement' },
//   { shortCode: 'CC', name: 'Colorectal Cancer' },
//   { shortCode: 'CD', name: 'Cardiovascular Disease Screening' },
//   { shortCode: 'DB', name: 'Diabetes Screening' },
//   { shortCode: 'DP', name: 'Depression Screening and Counselling' },
//   { shortCode: 'GS', name: 'Glaucoma Screening' },
//   { shortCode: 'IC', name: 'IBT for CVD' },
//   { shortCode: 'IO', name: 'IBT for Obesity' },
//   { shortCode: 'IV', name: 'Influenza Vaccine' },
//   { shortCode: 'LC', name: 'Lung Cancer Screening' },
//   { shortCode: 'PC', name: 'Prostate Cancer Screening' },
//   { shortCode: 'PE', name: 'Screening Pelvic Examinations' },
//   { shortCode: 'PP', name: 'Prolonged Preventive Care' },
//   { shortCode: 'PT', name: 'Screening Pap Tests' },
//   { shortCode: 'PV', name: 'Pneumococcal Vaccine' },
//   { shortCode: 'SC', name: 'Screening for Cervical Cancer with HPV tests' },
//   { shortCode: 'SM', name: 'Screening Mammography' },
// ];
export class HeadersDto {
id: number;
fullName: string;
code: string;
}
