export class LoginWithAthenaAssertionDto {
  patientEmrId: string;
  practiceId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string
  token: string
}
export class SubmitClaimDto {
  patientId: number;
  monthId: number;
  yearId: number;
  claimType: number;
}

export class AthenaUploadClaimInfo {
  emrClaimSubmitted: boolean;
  emrClaimSubmittedDate: Date;
  emrDocumentSubmitted: boolean;
  emrDocumentSubmittedDate: Date;
}
export class AthenaUploadClaimInfoResponse {
  CCM: AthenaUploadClaimInfo;
  RPM: AthenaUploadClaimInfo;
}


export class PatientEmrConnectInfoDto {
  id: number;
  lastSyncDate: Date;
  ccmEnrollmentStatusChangedDate?: any;
  ccmEnrollmentStatus?: any;
  carePlanUpdatedDate?: any;
  carePlanUpdatedBy?: any;
  patientId: number;
  patient?: any;
}
export class PatientEmrSummaryDataDto {
  readingDays: number;
  alertsCount: number;
  lastCcmDate: Date;
  lastRpmDate: Date;
  lastReadingDate: Date;
  nextCcmDate: Date;
}

export interface AthenaPracticeInfo {
  iscoordinatorsender: boolean;
  nsaenabled: boolean;
  hasclinicals: boolean;
  name: string;
  golivedate: string;
  experiencemode: string;
  hascommunicator: boolean;
  iscoordinatorreceiver: boolean;
  hascollector: boolean;
  ccmenabled: boolean;
  publicnames: string[];
  practiceid: string;
}

export class AthenaPracticeListDto {
  totalcount: number;
  practiceinfo: AthenaPracticeInfo[] = [];
}
export class AthenaClaimDocResponseDto {
  claimId: number;
  invoiceId: number;
  patientName: string;
  statusCode: string;
  responseMessage: string;
  actionType: string;
}
