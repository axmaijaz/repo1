export enum TermType {
  DevicePurchasePlan = 0
}
export enum PlanType {
  Buy = 0,
  Lease = 1,
  Own = 2
}
export enum DayName {
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6
}
export enum RpmQualityCheckedEnum {
    Failed = 0,
    Passed = 1,
    // Deferred = 2
}
export enum RpmQualityCheckedStatusEnum {
  Completed = 0,
  NotCompleted = 1,
  PartiallyCompleted = 2
}
// export enum RPMDuration
//     {
//         Mins1_5 = 0,
//         Mins6_10 = 1,
//         Mins11_15 = 2,
//         Mins16_20 = 3,
//         Mins21_25 = 4,
//         Mins26_30 = 5,
//         Mins31_35 = 6,
//         Mins36_40 = 7,
//         Read1_5 = 8,
//         Read6_10 = 9,
//         Read11_15 = 10,
//         Read16 = 11,
//     }
export enum RPMDuration
    {
        All = -1,
        'Min 0' = 0,
        'Min 1-4' = 1,
        'Min 5-9' = 2,
        'Min 10-14' = 3,
        'Min 15-19' = 4,
        'Min 20-24' = 5,
        'Min 25-29' = 6,
        'Min 30-34' = 7,
        'Min 35-39' = 8,
        'Above Min 40' = 9,
    }
    export enum RPMServiceType
    {
        'Interactive Call' = 0,
        SMS = 1,
        // 'Interactive Communication' = 2,
        Text = 3,
        'Voice Mail' = 4,
        'Data Analysis' = 6,
        'Other' = 5,
    }

    export enum Modalities {
      "BP" = 'Blood Pressure',
      "WT" = 'Weight',
      "PO" = 'Pulse oximetery',
      "BG" = 'Blood Glucose',
      "AT" =  'Activity',
      "CGM" = '',
      "OS" = 'Oxygen Saturation',
      "HR" = 'Heart Rhythm'
    }
