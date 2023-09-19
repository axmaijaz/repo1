export enum PatientStatus {
  // All = 0,
  // Active = 1,
  // Archived = 2,
  // Deceased = 3
  'Not Set' = 0,
  Active = 1,
  // All = 0,
  // 'In Active' = 2,
  Deceased = 3,
  // DeletedDueToDuplicateEntry = 4,
  // DeletedDueToAddedErronously = 5,
  // Deactivated = 6,
  'Unable To Contact' = 7,
  'Change Provider' = 8,
  'Other'
}
export enum DeletePatientEnum {
  None = 0,
  DuplicateEntry = 2,
  AddedErronously = 3
}
export enum CareProviderAssignedEnum {
  All = 0,
  Assigned = 1,
  UnAssigned = 2,
}
export enum RpmStatus {
  Active = 0,
  "Not Started" = 1,
  "Not Eligible" = 2,
  Identified = 3,
  Consented = 4,
  Declined = 5,
  'In Retrieval'  = 6,
  'Terminated Services '  = 7,
}

// export enum CcmStatus {
//   "Not Started" = 0,
//   "In Process" = 1,
//   Registered = 2,
//   "Awaiting Approval" = 3,
//   "Not Eligible" = 4,
//   Declined = 5,
//   Deferred = 6,
//   Active = 7,
//   Identified = 8,
//   Consented = 9,
//   "Insurance Eligible" = 10,
//   Scheduled = 11,
//   "Unable To Contact" = 12,
//   "NotAble To Provide Service" = 13,
//   "Clinically Not Appropriate" = 14,
//   "Minimum Requirement Not Met" = 15,
//   "Do Not Contact" = 16,
//   "Unenrolled Declines Further Care Management" = 17,
//   "Unenrolled Death" = 18,
//   "Unenrolled Changed Provider To Non Network" = 19,
//   "Unenrolled Ineligible" = 20,
//   "Added In Error" = 21,
//   Duplicate = 22,
//   Archive = 23,
//   "Please Schedule" = 24,
//   "HHC Deffered" = 25,
// }

export enum CcmStatus {
  // 'New' = 0,
  'Not Started' = 0,
  'Not Eligible' = 4,
  Declined = 5,
  Deferred = 6,
  Active = 7,
  'Unable To Contact' = 12,
  'Declined Further Care' = 17,
  'Unenrolled Death' = 18,
  'Change Provider' = 19,
  // 'Added In Error' = 21,
  // Duplicate = 22,
  'Please Schedule' = 24,
  'HHC Deffered' = 25,
  // 'Active TCM' = 26,
  Consented = 27
}

export enum EnrollmentStatus {
  Initiated = 0,
  Pending = 1,
  Enrolled = 2,
  NotEligible = 3,
  Refused = 4,
}

export enum ConsentType {
  Online = 0,
  Written = 1,
  Verbal = 2,
}
export enum ConsentNature {
  CCM = 0,
  RPM = 1,
  TCM = 2,
  BHI = 3,
  PrCM = 4
}
export enum DocumentType {
  CcmConsentDoc = 0,
  RpmConsentDoc = 1,
  TelemedicineConsentDoc = 2,
}

export enum SortOrder {
  Asc = 0,
  Desc = 1,
}
export enum CcmMonthlyStatus {
  "Not Started" = 0,
  "Call not answered" = 1,
  "Completed" = 2,
  "Partially Completed" = 3,
  // "Clinic Appointment Scheduled" = 4,
}
export enum RpmMonthlyStatus {
  "Not Started" = 0,
  "Call not answered" = 1,
  "Completed" = 2,
  "Partially Completed" = 3,
}
export enum CommunicationConsent{
  All = 0,
  'Sms Consented' = 1,
  'App Only (Manual)' = 2
}
export enum CarePlanUpdated{
  All = 0,
  Completed = 1,
  Incomplete = 2,
  '9 to 12 months' = 3,
  '12+ months' = 4,
}
export enum DaysPatientNotRespond{
  'Not Set' = 0,
  '7 to 13 Days' = 1,
  '14 to 21 Days' = 2,
  '21 to 30 Days' = 3,
  '30+ Days' = 4,
}
