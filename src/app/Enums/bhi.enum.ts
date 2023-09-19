export enum BhiStatusEnum {
  "Not Started" = 0,
  "On Hold" = 1,
  Declined = 2,
  'Active CoCM' = 3,
  'Active G-BHI' = 4,
  Archive = 5,
  "Active PCM" = 6,
  Deferred = 7,
}
export enum BhiMonthEnum {
  UnKnown = 0,
  FirstMonth = 1,
  SubsequentMonth = 2
}
export enum BhiEncounterTimeEnum {
  All = 0,
  Time_1_9 = 1,
  Time_10_19 = 2,
  Time_20_29 = 3,
  Time_30_39 = 4,
  Time_40_49 = 5,
  Time_50_59 = 6,
  Time_60_Above = 7,
  Time_0 = 8
}
export enum BhiMonthlyStatus {
  // "Not Started" = 0,
  // "Call not answered" = 1,
  // "Completed" = 0,
  // "Partially Completed" = 3,
  "Not Started" = 4,
  "Completed" = 0,
  "Partially Completed" = 1,
  "Call Not Answered" = 2,
  "Unable To Contact" = 3,
}
