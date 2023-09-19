export class PEMCaseDto {
  id: number;
  department: RingCentralDepartmentEnum;
  pemCaseStatus: PemCaseStatus;
  pemCaseQueryType: PemCaseQueryType;
  note: string;
  closedDate: Date | string | null;

  assignedToId: number | null;
  assignedTo: string;

  caseManagerId: number | null;
  caseManager: string;

  closedById: number | null;
  closedBy: string;

  patientUserId: string;
  patientName: string;
  phoneNumber: string;
  // phoneNumbers: AppUserPhoneNumberDto[];

  pemCaseDetails: PEMCaseDetailDto[];
}

export class Attachment {
  id: number;
  attachmentId: any;
  uri: string;
  type: string;
  contentType: string;
  vmDuration?: any;
  fileName?: any;
  size?: number;
  height?: number;
  width?: number;
}
export class PEMCaseDetailDto {
  id: number;
  ringCentralId:string | number | null;
  type: string;
  phoneNo: string;
  subject: string;
  direction: string;
  creationTime: string;
  conversationId: number | null;
  uri: string;
  responseTime: number;
  attachments: Attachment[];
}
export class PemCaseEditDto {
  id: number;
  facilityId: number;
  department: number;
  pemCaseStatus: PemCaseStatus;
  pemCaseQueryType: PemCaseQueryType;
  note: string;
  closedDate: Date | string;
  assignedToId: number;
  caseManagerId: number;
  closedById: number;
  userId: string;
}
export class SendFaxDto {
  Files: File[];
  CoverPageText: string;
  RecipientPhoneNumber: string;
  FileName: string;
  ContentType: string;
}

export class AppUserPhoneNumberDto {
  id: number;
  phoneNumber: string;
  userId: string;
}

export enum PemCaseStatus {
  Open = 0,
  "In Progress" = 1,
  Forwarded = 2,
  Closed = 3,
}
export enum RingCentralDepartmentEnum {
  PEM = 0,
}

export enum PemCaseQueryType {
  Appointment = 0,
  Scheduling = 1,
  "Med Refill" = 2,
  "Med Inquiry" = 3,
  "Prior Auth" = 4,
  "Staff Call" = 5,
  Other = 6,
}
export class PemMapNumberDto {
  patientId: number;
  secondaryPhoneNumber: string;
  primaryPhoneNumber: string;
  countryCallingCode: string;
}
export class TransferCaseDetailDto {
  destinationCaseId: number;
  ringCentralMessageIds = new Array<string | number>();
}
export class NewCaseWithDetailDto {
  sourceCaseId: number;
  ringCentralMessageIds = new Array<number | string>();
}
export class GetPemDataParams {
  patientName: string;
  caseTitle: string;
  pemCaseStatus: number = -1;
  pemCaseQueryType: number = -1;
  assignedToId: number = 0;
  caseManagerId: number = 0;
  closedById: number = 0;
  startDate: Date | string | null;
  endDate: Date | string | null;
  responseTime: number;
}
