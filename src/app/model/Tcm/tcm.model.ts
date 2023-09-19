import {
  DischargedToEnum,
  ContactMethodEnum,
  TcmStatusEnum,
  TcmRequirementsStatusEnum,
} from './tcm.enum';
import * as moment from 'moment';
import { SortOrder } from 'src/app/Enums/filterPatient.enum';
import { CareProvidersListDto } from '../Patient/patient.model';
export class PatientDischargeDto {
  id = 0;
  dischargeDate: Date | string;
  tentativeDischargeDate: Date | string;
  dischargedFrom: string;
  isTcmEligible: boolean;
  tcmEligibilityCondition: string;
  dischargedTo: DischargedToEnum;
  emergencyContactNo: string;
  followUpAppointment: Date | string | null;
  additionalNotes: string;
  patientId: number;
  tcmEncounterId: number;
}
export class TcmInitialCommDto {
  id = 0;
  contactMethod: ContactMethodEnum;
  // contactDate: Date | string = moment().format("YYYY-MM-DD hh:mm A");
  contactDate = new Date();
  followUpDate = '';
  note = '';
  isSuccessfull = false;
  tcmEncounterId: number;
  careProviderId: number;
  careProviderName: string;
}
export class NonFaceToFaceDto {
  id = 0;
  primaryDiagnosesCodes = new Array<DiagnosesCodes>();
  otherDiagnosesCodes = new Array<DiagnosesCodes>();
  findingsOnDischargeSummary: string;
  diagnosticTestsDispositions: string;
  medicationsUpdatedInEmr: boolean;
  educationOnComplianceAndUse: boolean;
  medicationChangesNote: string;
  referralFollowUpDiscussion: string;
  treatmentGuidance: string;
  otherDiscussions: string;
  tcmEncounterId: number;
}
export class DiagnosesCodes {
  code: string;
  detail: string;
}
export class FaceToFaceDto {
  id = 0;
  dateVisited: Date | string;
  location: string;
  medicationReview: boolean;
  medicationNotes: string;
  visitSummary: string;
  sbp: number;
  dbp: number;
  pulsePerMinute: number;
  temp: number;
  respRate: number;
  oxygenation: number;
  cptCode: string;
  serviceDate: Date | string;
  facilityUserId = 0;
  facilityUserName: string;
  tcmEncounterId: number;
  billingProviderId: number;
  billingProviderName: string;
}
export class TcmDocumentDto {
  id: number;
  title: string;
  path: string;
  tcmEncounterId: number;
  preSignedUrl = '';
}
export class TcmEncounterDto {
  id = 0;
  // isTcmEligible: boolean;
  tcmStatus: TcmStatusEnum;
  isTcmEligible: boolean;
  initialCommStatus: TcmRequirementsStatusEnum;
  patientDischargeStatus: TcmRequirementsStatusEnum;
  nonFaceToFaceStatus: TcmRequirementsStatusEnum;
  faceToFaceStatus: TcmRequirementsStatusEnum;
  dischargeDate: Date | string;
  dischargedFrom: string;
  dischargedTo: DischargedToEnum;
  hospitalizationDate: Date | string;
  reason: string;
  complexity: string;
  initCommDate: Date | string | null;
  commAttempts: number;
  faceToFaceScheduledDate: Date | string | null;
  faceToFaceDate: Date | string | null;
  signatureDate: string;
  patientId: number;
  tcmInitialComms = new Array<TcmInitialCommDto>();
  tcmDocuments = new Array<TcmDocumentDto>();
  patientDischarge = new PatientDischargeDto();
  nonFaceToFace = new NonFaceToFaceDto();
  faceToFace = new FaceToFaceDto();
}
export class TcmEncounterCloseDto {
  TcmEncounterId: number;
  ClosedStatus: number;
  ClosedStatusNote = '';
}
export class SignTcmEncounterDto {
  tcmEncounterId: number;
  cptCode: string;
}
export class AddEditTcmInitialCommDto {
  initialCommunication = new TcmInitialCommDto();
  followUpDate: string;
  // dischargeDate: string;
  patientId: number;
}
export class AddTcmEncounterDto {
  patientId: number;
  hospitalizationDate: Date | string | null;
}

export class TcmFilterPatient {
  PageNumber = 1;
  PageSize = 10;
  SearchParam = '';
  showAll = false;
  tcmStatus = -1;
  ccmStatus = -1;
  sortOrder: SortOrder = 0;
  FacilityId = 0;
  FacilityUserId: number;
  BillingProviderId = 0;
  customListId = 0;
  sortBy = '';
  hospitalizationDate = '';
  followupDate = '';
}
export class AssignTcmProvidersDto {
  patientId: number;
  tcmBillingProviderId: number;
  tcmCareFacilitatorId: number;
  tcmCareCoordinatorIds: number[] = [];
  tcmDateAssigned: string;
}

export class TcmBillingProvider {
	id: number;
	fullName: string;
	nameAbbreviation: string;
}

export class TcmCareFacilitator {
	id: number;
	fullName: string;
	nameAbbreviation: string;
}

export class TcmCareCoordinator {
	id: number;
	fullName: string;
	nameAbbreviation: string;
}

export class TcmEncounterForListDto {
	id: number;
	patientEmrId: string;
	fullName: string;
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	hospitalizationDate?: any;
	followupDate?: any;
	dateAssigned: string;
	isTcmEligible: boolean;
	initialContactStatus: number;
	tcmStatus: number;
	ccmStatus: number;
	dischargeDate: string;
	tentativeDischargeDate: string;
	tcmBillingProvider: TcmBillingProvider;
	tcmCareFacilitator: TcmCareFacilitator;
	tcmCareCoordinators: TcmCareCoordinator[];
	initialCommStatus: number;
	patientDischargeStatus: number;
	nonFaceToFaceStatus: number;
	faceToFaceStatus: number;
	initialCommStatusColor: string;
	patientDischargeStatusColor: string;
	nonFaceToFaceStatusColor: string;
	faceToFaceStatusColor: string;
	profileStatus: boolean;
	patientId: number;
}
