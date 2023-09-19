export class TmPatient {
  id: number;
  firstName: string;
  lastName: string;
  DOB: Date | string | null;
  email: string;
  phoneNumber: string;
}
export enum TmEncounterStatus {
  New = 0,
  NotificationSent = 1,
  Initiated = 2,
  Started = 3,
  Completed = 4,
  Aborted = 5,
  Submitted = 6
}
export class TmEncounterDto {
  id: number;
  status: TmEncounterStatus;
  emailSentTime: Date | string | null;
  smsSentTime: Date | string | null;
  startedTime: Date | string | null;
  encounterDuration: string;
  completedTime: Date | string | null;

  createdOn: Date | string;
  updatedOn: Date | string;

  facilityUserId: number;
  tmPatientId: number;
}
export class paginationData {
    pageNumber = 0;
    pageSize = 0;
    pageCount = 0;
    elementsCount = 0;
}
export class SentTMEncounterDto {
  patientId: number;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phoneNumber: string;
  billingProviderId: number;
  sendMethod = 2;
}
export class submitTmEncounterData {
  encounterId: number;
  billingProviderId: number;
  startedTime: Date | string;
  encounterDuration: string;
  completedTime: Date | string;
}
export enum TmViewState {
  loading,
  success,
  error
}
export class TMStatusChangedDto {
  encounterId: number;
  status: TmEncounterStatus;
}
