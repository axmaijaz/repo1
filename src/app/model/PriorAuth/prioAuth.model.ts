import { SortOrder } from "src/app/Enums/filterPatient.enum";

export class PriorAuthDto {
  id = 0;
  authorizationNumber = '' ;
  paRequestStatus = 1;
  paCaseStatus = 0;
  paPatientInformedStatus = 0;
  requestDate: Date | string | null;
  receivedDate: Date | string | null;
  authSentDate: Date | string | null;
  authApprovedDate: Date | string | null;
  validUntil: Date | string | null;
  location: string;
  reason: string;
  applicable: boolean | null;
  referredTo: string;
  referralSentDate: Date | string | null;
  speciality: string;
  sentTo: string;
  scheduledDate: Date | string | null;
  notes: string;
  paCaseTypeId = 0;
  paCaseTypeName = '';
  paCaseStepId?: number | null = null;
  paCaseStepName = '';

  patientId: number;
  patientName: string;

  insurancePlanId: number | null;
  insurancePlanName = '';

  requestingPhysicianId: number | null;
  requestingPhysician: FacilityUserForDisplay;

  assignedToId: number | null;
  assignedTo: FacilityUserForDisplay;

  caseCoordinatorId: number | null;
  caseCoordinator: FacilityUserForDisplay;

  caseManagerId: number | null;
  caseManager: FacilityUserForDisplay;

  paDocuments: PADocForListDto[];
}
export class PADocForListDto {
  id: number;
  title: string;
  path: string;
}

export class FacilityUserForDisplay {
  id: number;
  fullName: string;
  nameAbbreviation: string;
}
export class PAPatientsScreenParamsDto {
  PageNumber = 1;
  PageSize = 10;
  SearchParam = '';
  sortBy = '';
  excludeCaseType = false;
  excludeReqStatus = false;
  caseStatus = new Array<number>();
  reqStatus = new Array<number>();
  caseTypeId = new Array<number>();
  RequestingPhysicianId = 0;
  FacilityId = 0;
  FacilityUserId = 0;
  assignedToId = 0;
  fromRequestDate = '';
  toRequestDate = '';
  sortOrder: SortOrder = 0;
}

export enum PARequestStatus {
  InProgress = 0,
  Received = 1,
  Sent = 2,
  Approved = 3,
  Denied = 4,
  Scheduled = 5,
  Completed = 6,
}

export enum PACaseStatus {
  InProcess = 0,
  ReqComplete = 1,
  ClosedSuccess = 2,
  ClosedAbort = 3,
  ClosedError = 4,
}

export enum PAPatientInformedStatus {
  NotInformed = 0,
  InProgress = 1,
  Closed = 2,
  Aborted = 3,
  Other = 4,
}
export class PaCaseStep {
  id = 0;
  title: string;
  paCaseTypeId: number;
}

export class PACaseType {
  id = 0;
  title: string;
  facilityId?: number;
  paCaseSteps = new Array<PaCaseStep>();
}
