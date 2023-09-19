export class PatientNotificationDto {
  id: number
  missedAlertPush: boolean
  missedAlertSms: boolean
  readingAckSms: boolean
  disableProviderSmsAlert: boolean
  telephonyCommunication: boolean
  notificationTime = '';
  patientId: number
}

