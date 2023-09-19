export class AddEditCustomListDto {
    id = 0;
    name: string;
    description: string;
    columnsList: string;
    facilityUserId = 0;
    facilityId = 0;
    patientIds = new Array<number>();
    facilityUserName: string;
    isPublic = false;
    showNotes = false;
    showTasks = false;

}
export class ColumnDto {
  name: string;
  value: number;
  check: boolean;
}
 export class AssignPatientsToCustomListDto {
  customListIds = new Array<number>();
  patientIds = new Array<number>();
 }
 export class RemovePatientsToCustomListDto {
  customListId = 0;
  patientIds = new Array<number>();
 }

 export class HeadersDto {
  psychiatrist: boolean;
  bhiStatus: boolean;
  ccmStatus: boolean;
  emrId: boolean;
  name: boolean;
  ccmMS: boolean;
  careFacilitator: boolean;
  careManager: boolean;
  billingProvider: boolean;
  rpmStatus: boolean;
  dob: boolean;
  assignedDate: boolean;
  awvStatus: boolean;
  careProviders: boolean;
  rpmManager: boolean;
  tcmStatus: boolean;
}
