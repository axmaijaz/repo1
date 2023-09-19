export enum DepartmentType {
  Other = 0,
  General = 1,
  'Care Delivery' = 2,
  WorkPlace = 3,
  Technical = 4,

  RpmCompliance = 5
}

export enum ComplaintTypeEnum {
  'Patient RPM' = 1,
  '4G Device Request' = 2,
  'Other' = 3,
}
export enum ComplaintStatus {
  Open = 1,
  'In Process' = 2,
  // 'Show Stopper' = 3,
  Closed = 4,
}
export enum ComplaintPriority {
  Low = 1,
  Medium = 2,
  High = 3,
}
