import moment from "moment";
import { GapStatus, PcmEncounterStatus } from "../pcm/pcm.model";
import { AWServiceStatus } from "src/app/Enums/aw.enum";

export class AWEncounterDto {
  id: number;
  encounterDate: Date | string | null;

  patientId: number;
  awSections = new Array<AWSectionDto>();

  // aWScreenings: AWScreeningDto>();
}
export class AWPatienttabEncounterDto {
  id: number;
  status: PcmEncounterStatus;
  encounterDate: Date | string | null;
  patientAge: number;
  patientId: number;
  amScreeningId: number;
  depressionScreeningId: number;
  bmi: number;
  awSections = new Array<AWSectionDto>();

  // aWScreenings: AWScreeningDto>();
}
export class SignAwEncounterDto {
  awEncounterId: number;
  billingProviderId: number;
  signature: string;
  humanaMemberId: string;
  signatureDate: Date | string;
  encounterDate: Date | string;
  signHumana = false;
  signSuperBill = false;
}
export class AWPhysiciantabEncounterDto {
  status: PcmEncounterStatus;
  awEncounterId: number;
  isSyncDisabled: boolean;
  gapsData: string;
  amScreeningCompleted: boolean;
  depressionScreeningCompleted: boolean;
  physicalAssessmentNote: string;
  patientBillingProvider: string;
  encounterDate: string;
  selfAssessmentNote: string;
  behavioralNote: string;
  bmi: string;
  functionalAssessmentNote: string;
  homeSafetyAssessmentNote: string;
  hearingScreenNote: string;
  visionScreenNote: string;
  minicogScore: string;
  phqScore: string;
  alcoholScreenResult: string;
  patientAgreementLDCT: boolean;
  ldctScreening: boolean;
  ldctCounseling: boolean;
  ldctCounselingNote: string;
  tobaccoCessationCounseling: boolean;
  tobaccoCessationCounselingCode: string;
  tobaccoCessationNote: string;
  alcoholMisuseScreening: boolean;
  alcoholMisuseCounseling: boolean;
  alcoholMisuseNote: string;
  annuallDepressionScreening: boolean;
  annuallDepressionNote: string;
  endOfLifePlanning: boolean;
  endOfLifeNote: string;
  faceToFaceObesity: boolean;
  faceToFaceObesityCode: string;
  faceToFaceNote: string;
  faceToFaceCardiovascular: boolean;
  humanaMemberId: string;
  faceToFaceCardiovascularNote: string;
  awv: boolean;
  awvCode: string;
  awvNote: string;
  medicadeCPTCode: string;
  assignedBillingProviderId: number;
  signedBy: string;
  signatureDate: string;
  // tslint:disable-next-line: no-use-before-declare
  socialHistoryData = new SocialHistoryData();
  sixCIT: string;
}
export class SocialHistoryData {
  everUsedTobacco: string;
  currentlyUsingTobacco: string;
  currentSmokerOrQuitIn15Years: string;
  lungCancer: string;
  packsPerDay: string;
  noOfYears: string;
}
export class SendAWToPatientDto {
  awEncounterId: number;
  email: string;
  phoneNo: string;
  updateEmail = false;
  updatePhoneNo = false;
  urlLink: string;
}
export class AWProvidertabEncounterDto {
  id: number;
  status: PcmEncounterStatus;
  encounterDate: Date | string | null;
  cognitiveAssessmentDoc: string;
  patientId: number;
  patientAge: number;
  tcmUpdateAvailable: boolean;
  awSections = new Array<AWSectionDto>();

  awScreenings = new Array<AWScreeningDto>();
}
export class TCMEncounterForAWDto {
  dischargeDate: Date | string | null;
  dischargedFrom: string;
  reason: string;
}
export class AWScreeningDto {
  id = 0;
  awScreeningDesc: string;
  screeningDate?: string;
  physicianName?: string;
  selection?: string;
  isFemaleOnly: boolean;
  isDisabled: boolean;
  note?: string;
  awEncounterId: number;
}
export class AddEditAWScreeningDto {
  id = 0;
  awScreeningDesc: string;
  screeningDate?: string;
  physicianName?: string;
  selection?: string;
  isFemaleOnly: boolean;
  note?: string;
  awEncounterId: number;
}

export class AWSectionDto {
  id: number;
  description: string;
  staffNote: string;

  awQuestions = new Array<AWQuestionDto>();
  aWEncounterId: number;
}

export class AWQuestionDto {
  id: number;
  response: string;

  shortDesc: string;

  awQuestionLookupId: number;
  awSectionId: number;
}

export class AWEncounterListDto {
  id: number;
  encounterDate?: string | Date;
  patientId: number;
}
export class GetPWReportDto {
  report: string;
  hasPreviousReport: boolean;
}
export class GetAWReportDto {
  report: string;
  hasPreviousReport: boolean;
}
export class UpdatePWReportDto {
  report: string;
  awEncounterId: number;
}
export class UpdateAWReportDto {
  report: string;
  awEncounterId: number;
}
export class AWServiceStatusChangeDto {
  patientId: number;
  awServiceStatus: number;
}

export class FilterAwPatientsDto {
  FacilityId: number;
  ShowAll: boolean;
  FilterText: string;
  SearchParam: string;
  ServiceYear: number = +moment().format("YYYY");;
  CustomListId: number;
  SortBy: string;
  SortOrder: number;
  PageNumber: number;
  PageSize: number;
}
export class AwPatientListDto {
  patientId: number
  awEncounterId: number
  userId: string
  patientEmrId: string
  facilityName: string
  fullName: string
  firstName: string
  lastName: string
  dueGapsCount: number
  awEncounterStatus: PcmEncounterStatus
  awGapStatus: GapStatus
  awServiceStatus: AWServiceStatus
  hraCallStatus: HRACallStatus
  hraCallLogHistory: string
  hraFormSentDate: string
  hraFormSentBy: string
  hraFormCompletionPercentage: number
  awVisitScheduleDate: string
  recentPcpAppointmentDate: string
  encounterDate: string
  signatureDate: string
  telephonyCommunication: boolean
  patientStatus: number
  facilityId: number
  isDeleted: boolean;

  hraStatus: HRACallStatus; // extended
  hraNote: string // extended
}

export class AWVDashboardData {
  activePatientsCount: number
  eligiblePatientsCount: number
  completedPatientsCount: number
  notStartedPatientsCount: number
  otherPatientsCount: number
  hraFormSentCount: number
  hraScheduledForCallCount: number
  hraCallNotAnswered: number
  hraFormCompletedCount: number
  scheduleOfficeVisitCount: number
  notShowCount: number
}
export enum HRACallStatus {
  'Not Started' = 0,
  Scheduled = 1,
  'Call Not Answered' = 2,
  Declined = 3
}



