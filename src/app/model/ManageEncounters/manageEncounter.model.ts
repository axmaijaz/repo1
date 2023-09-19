export class EncounterObjectList {
  aWpendingEncounter: AWpendingEncounter[];
  tcMpendingEncounter: AWpendingEncounter[];
  pendingDepressionScreening: AWpendingEncounter[];
  pendingAMScreening: AWpendingEncounter[];
  pendingCouncellings: AWpendingEncounter[];
}

export class AWpendingEncounter {
  patientId: number;
  patientName: string;
  profileStatus: boolean;
  type: string;
  updatedOn: string;
  createdOn: string;
  updatedUser: string;
  typeId: number;
  assignedBillingProvider: string;
  billingProvider: string;
  careCoordinator: string;
  encounterDate: Date | string | null;
}

export class EncounterTypes {
  static aw = 'Annual Wellness';
  static depressionScreening = 'Depression Screening';
  static alcoholScreening = 'AM Screening';
  static tcm = 'Tcm Encounters';
  static counselling = 'Counselling';
}

export enum FilterType {
  Success = 1,
  InProcess = 2,
  All = 3
}

export class FilteredEncountersDto {
  facilityId: number;
  filterType: FilterType = FilterType.InProcess;
  billingProviderId = 0;
  assignedBillingProviderId = 0;
  careCoordinatorStaffId = 0;
  dateAssignedFrom = '';
  dateAssignedTo = '';
  searchParam = '';
}
