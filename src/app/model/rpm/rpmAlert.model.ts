export class RpmAlertListDto {
  id: number;
  addressedById: number;
  alertReason: string;
  alertStatus: number;
  note: string;
  modality: string;
  alertTime: Date | string;
  dueTime: Date | string;
  timeOut: Date | string;
  smsCount: number;
  smsTime: Date | string;
  callCount: number;
  callTime: Date | string;
  patientId: number;
  patientName: string;
  phone: string;
  email: string;
  facilityName: string;
  facilityId: number;
  rpmCC: string;
  alertManager: string;
  reading: string;
  isDue: boolean;
  measurementDate: string;
}
export class SendAlertSmsDto {
  patientId: number;
  rpmAlertId: number;
  messageText: string;
  timeOut: Date | string | string;
}
export class AddRpmAlertCallDto {
  alertId: number;
  callNote: string;
  callTime: string;
  timeOut: Date | string;
  isSuccessfull: boolean;
}
export enum AlertStatusEnum {
  NotStarted = 0,
  ReviewAlert = 1,
  AwaitedResult = 2,
  AlertOverDue = 3,
  UnableToContact = 4,
  Closed = 5,
  Duplicate = 6,
  NonCompliant = 7,
  Refused = 8,
}

export class EditRpmALertDto {
  id: number;
  alertStatus: AlertStatusEnum;
  note: string;
}

export class SendRpmAlertChatDto {
  alertId: number;
  message: string;
  facilitatorId: number;
}
export abstract class AlertReason {
  static OutOfRange = "Out Of Range";
  static NotReceived = "Not Received";
}


export class PatientAlertConfigDto {
  patientId: number;
  notificationTime: string
  enableNotification: boolean
}
