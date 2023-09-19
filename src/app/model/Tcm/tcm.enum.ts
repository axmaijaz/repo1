export enum ContactMethodEnum {
  PhoneCall = 0,
  SMS = 1,
  Email = 2
}

export enum DischargedToEnum {
  None = 0,
  Home = 1,
  Domiciliary = 2,
  RestHome = 3,
  'Assisted Living' = 4,
  Others = 5
}
export enum TcmStatusEnum {
  None = 0,

  'In Hospital' = 1,
  'In Process' = 2,

  Closed_TimeLapse = 3,
  Closed_IneligibleDischarge = 4,
  Closed_Death = 5,
  Closed_Successful = 6,
  Closed_AddErrornously = 7,
  Closed_Duplicate = 8,
  Closed_WrongPatient = 9,
  Closed_Other = 10,
  re_admission = 11

  //Discharged = 2,
  //DCSArranged = 3,
  //FupArranged = 4,
  //SuccessfullyContacted = 5,
  //NFTF = 6,
  //FTF = 7,
  //Completed = 8,
  //NotEligible = 9,
  //TcmNotDone = 10
}
export enum TcmRequirementsStatusEnum {
  'To Do' = 0,
  'In Process' = 1,
  Completed = 2
}
// export enum ClosedStatus {
// 	TimeLapse = 1,
// 		IneligibleDischarge = 2,
// 		Death = 3,
// 		Successful = 4,
// 		AddErrornously = 5,
// 		Duplicate = 6,
// 		WrongPatient = 7,
// 		Other = 8
// }
export enum tcmStatus2Enum {
  None = 0,
  InHospital = 1,
  InProcess = 2,
  'Closed-TimeLapse' = 3,
  'Closed-IneligibleDischarge' = 4,
  'Closed-Death' = 5,
  'Closed-Successful' = 6,
  'Closed-AddErrornously' = 7,
  'Closed-Duplicate' = 8,
  'Closed-WrongPatient' = 9,
  'Closed-Other' = 10,
  're-admission' = 11
}
