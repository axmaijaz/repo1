export class FacilityNotificationDto {
  id: number
  missedAlertPush: boolean
  missedAlertSms: boolean
  readingAckSms: boolean
  providerSmsAlert : boolean
  notificationTime = new FacilityNotificationTimeDto();
  footerText: string;
  facilityId: number
}

export class FacilityNotificationTimeDto {
  hour: number
  minute: number
  second: number
  millisecond: number
  ticks: number
}
