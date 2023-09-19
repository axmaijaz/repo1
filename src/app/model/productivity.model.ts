import { SortOrder } from "../Enums/filterPatient.enum";

export class GetPRDataParam {
  from = "";
  to = "";
  facilityIds: number[];
  facilityUserIds = [0];
  sortBy= "";
  sortOrder: SortOrder = 0;
  encounterType: number[];
  PRCredit: boolean;
}
export class PRStatListDto {
  id: number;
  serviceType: TwoCModulesEnum;
  encounterType: ProductivityEncounterTypeEnum;
  status: string;
  encounterTime: string;
  cummulativeEncounterTime: string;
  credit: number;
  encounterRefId: number;
  encounterDate: string;
  patientId: number;
  patientName: string;
  facilityName: string;
  facilityUserId: number;
  facilityUserName: string;
  facilityId: number;
  qualityChecked: number;
  qualityCheckedByName: string;
  qualityCheckedDate: string;
  paid: boolean;
}
export enum TwoCModulesEnum {
  CCM = 0,
  RPM = 1,
  TCM = 2,
  BHI = 3,
  PrCM = 4,
  AWV = 5,
}

export enum ProductivityEncounterTypeEnum {
  All = -1,
  'CCM 20' = 0,
  'CCM 40' = 1,
  'CCM 60' = 2,
  'RPM 99457' = 3,
  'RPM 99458' = 4,
  Transmission = 5,
  AWV = 6,
}
