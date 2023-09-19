export class EgvRange {
  name: string;
  bound: number;
}

export class TargetRange {
  name: string;
  startTime: string;
  endTime: string;
  egvRanges: EgvRange[] = [];
}

export class DexcomGetStatParamDto {
  targetRanges: TargetRange[] = [];
}
export class DexcomDevicesResObj {
  recordType: string
  recordVersion: string
  userId: string
  records: DexcomDeviceRecord[]
}

export class DexcomDeviceRecord {
  transmitterGeneration: string
  displayDevice: string
  displayApp: string
  lastUploadDate: string
  alertSchedules: AlertSchedule[]
  transmitterId: string
  softwareVersion: string
  softwareNumber: string
  language: string
  isMmolDisplayMode: boolean
  isBlindedMode: boolean
  is24HourMode: boolean
  displayTimeOffset: number
  systemTimeOffset: number
}

export class AlertSchedule {
  alertScheduleSettings: AlertScheduleSettings
  alertSettings: AlertSetting[]
}

export class AlertScheduleSettings {
  alertScheduleName: string
  isEnabled: boolean
  startTime: string
  endTime: string
  isActive: boolean
  override: Override
  daysOfWeek: string[]
}

export class Override {
  isOverrideEnabled: boolean
  mode: string
  endTime: string
}

export class AlertSetting {
  systemTime: string
  displayTime: string
  alertName: string
  value: number
  unit: string
  snooze: number
  enabled: boolean
  secondaryTriggerCondition: number
  soundTheme: string
  soundOutputMode: string
}


export class DexcomStatisticsResDto {
  hypoglycemiaRisk: string;
  min: number;
  max: number;
  mean: number;
  median: number;
  variance: number;
  stdDev: number;
  sum: number;
  q1: number;
  q2: number;
  q3: number;
  utilizationPercent: number;
  meanDailyCalibrations: number;
  nDays: number;
  nValues: number;
  nUrgentLow: number;
  nBelowRange: number;
  nWithinRange: number;
  nAboveRange: number;
  percentUrgentLow: number;
  percentBelowRange: number;
  percentWithinRange: number;
  percentAboveRange: number;
}
export class SampleDexcomDeObj {
  static data = {
    targetRanges: [
      {
        name: 'day',
        startTime: '07:00:00',
        endTime: '20:00:00',
        egvRanges: [
          {
            name: 'urgentLow',
            bound: 55,
          },
          {
            name: 'low',
            bound: 80,
          },
          {
            name: 'high',
            bound: 250,
          },
        ],
      },
      {
        name: 'night',
        startTime: '20:00:00',
        endTime: '07:00:00',
        egvRanges: [
          {
            name: 'urgentLow',
            bound: 55,
          },
          {
            name: 'low',
            bound: 80,
          },
          {
            name: 'high',
            bound: 250,
          },
        ],
      },
    ],
  };
}
