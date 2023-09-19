import { PatientStatus } from "./../../Enums/filterPatient.enum";
import { UploadFile } from "ng-uikit-pro-standard";
import {
  EnrollmentStatus,
  ConsentType,
  SortOrder,
  CcmMonthlyStatus,
} from "src/app/Enums/filterPatient.enum";
import { RpmPHDeviceListDto } from "../Inventory/rpm-inventory.model";

export class PatientDto {
  phoneNumberConfirmed: boolean;
  isBHIRevoked: boolean;
  isCCMRevoked: boolean;
  isRPMRevoked: boolean;
  msQualityCheckedByName = "";
  msQualityCheckedByNameAbbreviation = "";
  hasAuthenticator = false;
  twoFactorEnabled = false;
  id = 0;
  userId = "";
  facilityId = 0;
  patientEmrId = "";
  nextGenId = "";
  careManager: any;
  checked: any;
  billingProviderNameAbbreviation = "";
  careFacilitatorNameAbbreviation = "";
  dueGapsCount = 0;
  fullName = "";
  currentMonthCompletedTime = "";
  lastCcm = "";
  // recentPcpAppointment = new Date();
  recentPcpAppointment = null;
  careProviderNames = new Array<string>();
  careFacilitatorName = "";
  careFacilitatorId? = 0;
  insurancePlanId?: number = null;
  secondaryInsurancePlanId?: number = null;
  ccmNotBillable: boolean;
  insurancePlanName?: string;
  secondaryInsurancePlanName?: string;
  firstName = "";
  lastName = "";
  middleName = "";
  nickname = "";
  ccmStatus = 0;
  hhcEndDate = "";
  hhcEndDateClass = "";
  rpmStatus = 0;
  pcmStatus = 1;
  email = "";
  userName = "";
  password = "";
  currentAddress: string;
  ccmMonthlyStatus = 0;
  rpmMonthlyStatus = 0;
  msQualityChecked = false;
  dateAssigned: Date | string;

  mailingAddress: string;
  carePlanStatusColor: number;
  maillingAddressState: string;
  maillingAddressCity: string;
  maillingAddressZipCode: string;
  primaryPhoneNumber: string;
  city = "";
  state = "";
  zip = "";
  country = "";
  homePhone = "";
  dateOfBirth: Date | string;
  isConsentTaken = false;
  consentType: ConsentType;
  modifiedDate = new Date();
  consentDocUrl: "";
  emergencyPlan = "";
  bestTimeToCall = "";
  preferredLanguage = "";
  consentDate = new Date();
  chronicDiagnosesIds = new Array<number>();
  sex = "";
  bhiStatus: number;
  bhiCareManagerId: number;
  psychiatristId: number;
  socialSecurityNumber = "";
  personNumber = "";
  medicalRecordNumber = "";
  otherIdNumber = "";
  billingProviderId = 0;
  careProviderName = "";
  billingProviderName = "";
  enrollmentStatus: EnrollmentStatus;
  profileStatus: boolean;
  insuranceNumber = "";
  secondaryInsuranceNumber = "";
  medicareNumber = "";
  planAYear = "";
  planAMonth = "";
  planBYear = "";
  planBMonth = "";
  careProviders = new Array<CareProvidersListDto>();
  emergencyContactName = "";
  emergencyContactRelationship = "";
  emergencyContactPrimaryPhoneNo = "";
  emergencyContactSecondaryPhoneNo = "";
  secondaryPhoneNumber = "";
  specialists = new Array<PatientSpecialistDto>();
  patientConsents = new Array<PatientConsents>();
  isDeleted: boolean;
  ccmDate: Date | string;
  lastCcmDate: Date | string;
  ccmFlagged: boolean;
  enteredByName: string;
  lastAppLaunchDate: string;
  isActiveMobileUser: boolean;
  qualityCheckStatus: number;
  msQualityCheckedDate: string;
  countryCallingCode: string;
  stickyNoteHigh: string;
  stickyNoteMedium: string;
  stickyNoteLow: string;
  statusChangedBy: string;
  lastStatusChangeDate: string;
  maskedHomePhone: string;
  isCCMConsentTaken: boolean;
  isRPMConsentTaken: boolean;
  isBHIConsentTaken: boolean;
  isPCMConsentTaken: boolean;
  isEmailVerified: boolean;
  telephonyCommunication: boolean;
  unAssociatedCommunication: number;
  carePlanUpdatedDate: string;
  patientId: number;
  ["ccmStatusString"]: string;
  ["ccmMonthlyStatusString"]: string;
  ["rpmStatusString"]: string;
  ["careProvidersNameString"]: string;
}
export class CareProvidersListDto {
  careProviderId: number;
  fullName = "";
  nameAbbreviation = "";
}

export class PatientListDto {
  id: number;
  patientEmrId: string;
  fullName: string;
  city: string;
  state: string;
  country: string;
  isConsentTaken: true;
  consentDate: string;
  modifiedDate: string;
  billingProviderId: number;
  billingProviderName: string;
  careProviderNames: string[];
  chronicDiseasesIds = Array<number>();
  currentMonthCompletedTime: number;
  currentMonthCompletedTimeString: string;
  profileStatus: true;
  sex: string;
  patientStatus: number;
  assigned: number;
  rpmStatus: number;
  ccmStatus: number;
  ccmMonthlyStatus: number;
  facilityId: number;
  ccmDate: string;
  lastCcmMinutes: string;
  lastCcm: string;
  recentPcpAppointment: string;
  telephonyCommunication: boolean
}
export class DiagnosisDto {
  id = 0;
  patientId = 0;
  practiceName = "";
  encounterTimestamp = new Date();
  icdCode = "";
  icdCodeSystem = "";
  addToChronic: boolean;
  description = "";
  diagnosisDate: Date | string;
  resolvedDate: Date | string;
  statusId = "";
  isChronic: boolean;
  isOnRpm: boolean;
  note = "";
  wasRecordedElsewhere: boolean;
}
export class AssignPatientsToCareProvider {
  patientIds = new Array<number>();
  careProviderIds = new Array<number>();
}

export class AssignRemoveCareProvidersToPatientsDto {
  patientIds = new Array<number>();
  careProviderIdsToAssign = new Array<number>();
  careProviderIdsToRemove = new Array<number>();
  careFacilitatorId = 0;
  dateAssigned = "";
}
export class AssignRPMCareCoordinatorsToPatientsDto {
  patientIds = new Array<number>();
  careCoordinatorIdsToAssign = new Array<number>();
  coordinatorsIdsToRemove = new Array<number>();
  careFacilitatorId = 0;
  dateAssign: string;
}
export enum GenderEnum {
  Male = 0,
  Female = 1,
  Unknown = 2,
}
export class PatientSpecialistDto {
  id = 0;
  practiceId = "";
  firstName = "";
  lastName = "";
  middleName = "";
  phone = "";
  degree = "";
  specialty = "";
  prevAppointment = "";
  nextAppointment = "";
  patientId = 0;
}
export class FilterPatient {
  PageNumber = 1;
  PageSize = 10;
  PatientStatus = 1;
  Assigned = 0;
  ccmStatus = [0, 7, 27,24];
  ccmMonthlyStatus = [-1];
  ccmTimeRange = [0];
  RpmStatus = -1;
  profileStatus = 0;
  customListId = 0;
  consentDate = 0;
  DateAssignedFrom = "";
  DateAssignedTo = "";
  modifiedDate = 0;
  chronicDiseasesIds: any = ["0"];
  tempChronicDiseasesIds: any;
  conditionsIds = ["0"];
  //  rpmStatus
  rowIndex = 0;
  SearchParam = "";
  sortBy = "";
  filterBy = 1;
  sortOrder: SortOrder = 0;
  serviceMonth = new Date().getMonth() + 1;
  serviceYear = new Date().getFullYear();
  FacilityId = 0;
  FacilityUserId: number;
  CareProviderId: number;
  BillingProviderId = 0;
  communicationConsent = 0;
  carePlanUpdated = 0;
  patientNotRespond = 0;
}
export class CcmStatusChangeDto {
  patientId = 0;
  newStatusValue = 0;
  appUserId: string;
  reason: string;
  hhcEndDate: string;

}
export class PatientNoteDto {
  id = 0;
  note = "";
  dateCreated: Date | string;
  tag = "";
  patientId = 0;
  facilityUserId = 0;
  facilityUserName = "";
  updatedUser = "";
}

export class ChronicIcd10CodeDto {
  id = 0;
  icdCode = "";
  detail = "";
  chronicConditionId = 0;
  algorithm = "";
}
export class MedicationDto {
  id = 0;
  medicationName = "";
  // genericName = '';
  // brandName = '';
  frequency = "";
  dose = "";
  rxCui = "";
  // route = '';
  // doseForm = '';
  // originalStartDate = '';
  startDate = "";
  stopDate = "";
  status = "";
  // sigDescription = '';
  // medicationId = 0;
  // ndcId = '';
  // rxNormCode = '';
  patientId = 0;
}
export class CareplanApprovalDto {
  id: number;
  status: string; /// Pending, Approved, Reject, NeedToApprove
  approvedDate: string;
  comments: string;
  billingAppUserId: string;
}
export class AllergyDto {
  id = 0;
  date: string;
  agent: string;
  reaction: string;
  type: number;
  criticality: number;
  clinicalStatus: number;
  category: number;
  patientId: number;
}
export class MasterCarePLanDto {
  id = 0;
  lastApprovedDate: Date | string;
  currentApprovalUpdatedOn: Date | string;
  dateUpdated: Date | string;
  challengesWithTransportation: boolean;
  challengesWithVision: boolean; //use
  challengesWithHearing: boolean; //use
  challengesWithMobility: boolean; //use
  functionalNone: boolean;
  challengesWithEnglish: boolean;
  challengesComments: string;
  religionImpactsOnHealthCare: boolean;
  religionImpactOnHealthCareComments: string;
  healthCareAdvancedDirectives: boolean;
  healthCareAdvancedDirectivesComments: string;
  polst: boolean;
  polstComments: string;
  powerOfAttorney: boolean;
  powerOfAttorneyComments: string;
  accomodation: string;
  iLearnBestBy: string;
  iLearnBestByComment: string;
  internetAccess: boolean; //use
  dietIssues: boolean;
  dietIssuesComments: string;
  iLive: string; //use
  concernedAboutManagingChronicCondition: boolean;
  concernedAboutFinantialIssues: boolean;
  concernedAboutAccessToHealthCare: boolean;
  concernedAboutEnergyLevelFatigue: boolean;
  concernedAboutEmotionalIssues: boolean;
  concernedAboutFamilyIssues: boolean;
  concernedAboutSpiritualSupport: boolean;
  concernedAboutMemoryProblems: boolean;
  concernedAboutEndOfLife: boolean;
  concernedAboutOther: string;
  satisfactionWithMedicalCare = 0;
  satisfactionComment: string;
  wantToImproveOnComment: string;
  patientId: number;
  isG0506: boolean;
  isApprovedByBillingProvider: false;
  status = "NeedToApprove";
  carePlanApproval = new CareplanApprovalDto();
  updatedUser: string;
  carePlanUpdatedDate: string;

  physicianSuggestedDietPlan: string;
  physicalNote: string;

  dailyLivingBath: boolean;
  dailyLivingWalk: boolean;
  dailyLivingDress: boolean;
  dailyLivingEat: boolean;
  dailyLivingTransfer: boolean;
  dailyLivingRestroom: boolean;
  dailyLivingNone: boolean;
  dailyLivingAll: boolean;
  dailyLivingActivitiesNote: string;

  instrumentalDailyGrocery: boolean;
  instrumentalDailyTelephone: boolean;
  instrumentalDailyHouseWork: boolean;
  instrumentalDailyFinances: boolean;
  instrumentalDailyTransportation: boolean;
  instrumentalDailyMeals: boolean;
  instrumentalDailyMedication: boolean;
  instrumentalDailyNone: boolean;
  instrumentalDailyAll: boolean;
  instrumentalDailyActivitiesNote: string;

  facingMemoryProblem: string;
  littleInterest: number;
  feelingDown: number;
  helpWithTransportation: string;
  healthcareFacility: boolean;
  secondLanguage: boolean;
  cellPhone: boolean;
  cellPhoneNumber: string;
  textMessages: boolean;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPrimaryPhoneNo: string;
  emergencyContactSecondaryPhoneNo: string;

  careGiverContactName: string;
  careGiverContactRelationship: string;
  careGiverContactPrimaryPhoneNo: string;
  careGiverContactSecondaryPhoneNo: string;
  careGiver: string;
  esl: string;
  utilizingCommunity: string;
  advancedDirectivesPlans: boolean;
  discussWithPhysician: boolean;
  advanceDirectivesNote: string;
  isCCMConsentTaken: string;
  ccmStartedDate: string;
  billingProviderName: string;
  careCoordinatorName = [];
  carePlanStatusColor: number;
  dailyLiving = [];
  instrumentalDaily = [];

  isCarePlanUpdate: boolean;
  carePlanUpdatedBy: string;
}
export class AllChronicDiseaseDto {
  id: number;
  detail = "";
  icdCode = "";
}
export class DeletPatientDto {
  patientId = 0;
  reasonDeleted: number;
  reasonDeleteDetails: string;
}
export class SetPatientInactive {
  patientId = 0;
  status: PatientStatus;
  reason: string;
}
export class DownloadLogHistoryDto {
  facilityId = 0;
  monthId = 0;
  includeCarePlan = false;
  includeLogsHistory = true;
  isCompleted = false;
  isActive = false;
  yearId = new Date().getFullYear();
  patientIds = new Array<number>();
}
export class SelectChronicDiseaseDto {
  id: 0;
  icdCode = "";
  icdCodeSystem = "";
  description = "";
  detail = "";
}
export class SelectedCronicDisease {
  code: "";
  detail: "";
}
export class DeleteDiagnoseDto {
  patientId: number;
  diagnosisId: number;
}
export class DeleteMedicationDto {
  patientId: number;
  medicationId: number;
}
export class DeleteAllergyDto {
  patientId: number;
  allergyId: number;
}
export class DeleteImmunizationDto {
  patientId: number;
  immunizationId: number;
}
export class PatientConsents {
  consentDate = "";
  consentDocUrl: string;
  consentDocVersion: string;
  consentNature = "";
  consentSignature = "";
  consentType: number;
  id = 0;
  createdBy: string;
  isConsentTaken: boolean;
  patientId = 0;
  patientBillingProviderName: string;
  consentNature1: number;
  isRevoked: boolean;
  revokeDate: string;
  revokedReason: string;
  patientName: string;
  consentDocName: string;
  Signature: string;
  files: UploadFile;
  note = "";
  isSaveAndConsentTaken: boolean;
}
export class consentDto {
  patientConsentsDto = new Array<PatientConsents>();
  patientName: string;
  billingProviderName: string;
}
export class EditPatientProfileDto {
  patientId: number;
  primaryPhoneNo = "";
  secondaryContactNo = "";
  countryCallingCode = "";
  currentAddress = "";
  mailingAddress = "";
  city = "";
  state = "";
  zip = "";
  emergencyContactName = "";
  emergencyContactRelationship = "";
  emergencyContactPrimaryPhoneNo = "";
  emergencyContactSecondaryPhoneNo = "";
}
export class CcmStatusEnumArray {
  number: number;
  word = "";
}
export class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

export class PatientActieServicesDto {
  activeServices = new Array<ActiveServiceDto>();
}

export class ActiveServiceDto {
  serviceName: string;
  lastEncounterDate: Date | string | null;
  assignedDate: Date | string | null;
  updatedDate: Date | string | null;
}
export class PatientNoteDataStorageDto {
  patientId: number;
  tag: string;
  note: string;
}
export class DiseaseOnServicesDto {
  isOnCcm: boolean;
  isOnRpm: boolean;
}
export class EditPatientChronicConditionNoteDto {
  chronicConditionId: number;
  patientId: number;
  note: string;
}
export class StickyNotesDto {
  patientId: number;
  stickyNoteHigh: string;
  stickyNoteMedium: string;
  stickyNoteLow: string;
}
export class ServiceNames {
  bhi: boolean;
  ccm: boolean;
  pcm: boolean;
  rpm: boolean;
}
export class PatientDetailsForAdmin extends PatientDto {
  phDeviceDtos: RpmPHDeviceListDto;
  patientStatus: number;
}
export class SearchPatient {
  // patientId: number;
  firstName = "";
  lastName = "";
  phoneNo = "";
  emrId = "";
  fullName = "";
  facilityId = 0;
  patientId = 0;
  reasonDeleteDetails = "";
}
export class UpdateChronicDiseaseDto {
  id: number;
  isOnRpm: boolean;
  isOnCcm: boolean;
}
export class ChronicDiseaseDto {
  algorithm: string;
  id: number;
  isOnCcm: boolean;
  isOnRpm: boolean;
}
export class EditPatientPreferencesDto{
  patientId: number;
  bestTimeToCall: string;
  preferredLanguage: string;
}
