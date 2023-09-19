import { TwoCModulesEnum } from "../AppModels/app.model";

export class AddCommunicationDto {
  message: string;
  senderUserId: string;
  patientId: number;
  method: CommunicationMethod = CommunicationMethod.Telephony;
  facilityId: number;
}
export class MarkCommunicationViewedDto {
  patientCommunicationId: number;
  isViewed: boolean;
}

export class PatinetCommunicationGroup {
  id: number;
  name: string;
  critical: boolean;
  following: boolean;
  unread: number;
  lastCommunication: PatientCommunicationHistoryDto;
  unAssociatedCommunication: number;

  selected: boolean; // extended
}
export class AnonymousPatientCommunicationGroup {
  attachments: [];
  conversationId: number;
  creationTime: string;
  direction: string;
  id: number;
  pemCaseId: number;
  phoneNo: string;
  responseTime: number;
  ringCentralId: string;
  subject: string;
  type: string;
  uri: string;
}

export class GetCommunicationGroupParam {
  PageNumber = 1;
  PageSize = 100000;
  UnRead: boolean;
  Critical: boolean;
  Following: boolean;
  SortBy: string;
  SortOrder: number;
}
export class MarkPatientGroupFlagsDto {
  patientId: number;
  critical: boolean;
  following: boolean;
}

export class ChangeCommunicationFlagsDto {
  patientUserIds: string[]
  critical: boolean
  following: boolean
  unRead: boolean
}

export class PatientCommunicationHistoryDto {
  id: number
  ringCentralMessageId: string
  direction: number
  method: CommunicationMethod;
  type: CommunicationType;
  fromPhoneNumber: string
  toPhoneNumber: string
  message: string
  timeStamp: string
  isRead: boolean
  serviceType: TwoCModulesEnum
  encounterRefId: number
  senderUserId: string
  senderName: string
  patientId: number
  patientName: string
  patientFirstName: string
  patientLastName: string
  patientUserId: string
  shortCode: string; // extended
  selected: boolean; // extended
}

export class CommunicationSummaryData {
  unread: number;
  critical: number;
  following: number;
  anonymous: number;
}

export enum CommunicationMethod {
  Telephony = 0,
  App = 1,
}

export enum CommunicationType {
  Text = 0,
  SMS = 1,
  Document = 2,
}

export enum CommunicationDirection {
  Inbound = 0,
  Outbound = 1,
}
