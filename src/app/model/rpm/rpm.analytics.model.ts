export class GroupedReading {
  name: string;
  patientsCount: number;
  readingsCount: number;
}

export class RpmAnalyticsDto {
  totalReadingsCount: number;
  patientsCount: number;
  tenantsCount: number;
  groupedReadings: GroupedReading[];
}
export enum RpmDailyReadingsFilterEnum {
  Last24Hours = 0,
  Last7Days = 1,
  Last30Days = 2,
  Custom = 3,
}
