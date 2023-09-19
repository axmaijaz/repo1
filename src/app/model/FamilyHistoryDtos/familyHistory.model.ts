export class AddFamilyHistoryDto {
  // id: number;
  patientId: number;
  selectedLookups = new Array<FHLookUpDto>();
}
export class FamilyHistoryListDto {
  id: number;
  relation: string;
  condition: string;
  note: string;
  updatedOn: Date;
  patientId: number;
}
export class FHLookUpDto {
  id: number;
  condition: string;
  father?: boolean;
  mother?: boolean;
  brother?: boolean;
  sister?: boolean;
  son?: boolean;
  daughter?: boolean;
}
