import { TwoCModulesEnum } from "../productivity.model"
import { CommunicationMethod } from "./communication.model"

export class PostBulkCommDto {
  message: string
  senderUserId: string
  patientIds: number[]
  facilityId: number
  method: CommunicationMethod
}



export class TemplateGroupListDto {
  id: number
  title: string
  text: string
  templateGroup: PatientCommTemplateGroup
  facilityId: number

  templateGroupName: string // extended
  selected: boolean; // extended
}
export class AddEditCommunicationTemplate {
  id: number
  title: string
  text: string
  templateGroup: PatientCommTemplateGroup
  facilityId: number
}
export class CommunicationTagListDto {
  id: number
  name: string
  facilityId: number
  facilityName: string
}
export class BulkCommTagData {
  tagName: string
  patientsCount: number
  patients: PatientTagData[]
  tagSection: TagSection; // Parent
  tagCategory: TagCategory; // Child

  tagCategoryName: string; // extended
  tagSectionName: string; // extended
}
export class PatientTagData {
  patientId: number
  firstName: string
  middleName: string
  lastName: string
  dob: string
  lastCommDate: string
  reviewNote: string
  telephonyCommunication: boolean;
  chronicConditions: string[];

  selected: boolean; // extended
  onDobPreview: boolean; // extended
  onStatsuPreview: boolean; // extended
  reviewNoteCopy: string; // extended
}
export class FilterTagDataParam {
  facilityId: number;
  communicationMethod: CommunicationMethod = CommunicationMethod.Telephony
  serviceModule: TwoCModulesEnum = TwoCModulesEnum.CCM;
  communicationState: CommunicationStateEnum = CommunicationStateEnum.NotCommunicating;
}



// For UI
export class BulkTemplateDataGroupDto {
  Key: string;
  collapsed: boolean;
  values: TemplateGroupListDto[] = []
}
// For UI
export class BulkTagSection {
  Key: string;
  collapsed: boolean;
  patients: PatientTagData[] = [];
  values: BulkTagDataGroupDto[] = []
}
// For UI
export class BulkTagDataGroupDto {
  Key: string;
  collapsed: boolean;
  showAll: boolean;
  values: BulkCommTagData[] = []
}
// For UI
export class NewBulkCommTemplateListDto {
  id: number
  title: string
  text: string
  facilityId: number;
  collapsed: boolean;
  selectedTab: string = 'tempMessage';
  headerType: string = 'none';
  headerText: string = '';
  patientsCount: number;
  previewCount: number;
  patients: PatientTagData[]
  tags: BulkCommTagData[] = [];


}

export enum CommunicationStateEnum {
  All = 0,
  InCommunication = 1,
  NotCommunicating = 2
}



export enum PatientCommTemplateGroup {
  Appointments = 0,
  'Care Management' = 1,
  'Life Style' = 2,
  Covid = 3,
  Medication = 4,
  Vitals = 5,
  Symptoms = 6,
  Miscellaneous = 7

}

export enum TagCategory {
  Custom = 0,
  ChronicConditions = 1,
  Auto = 2,
  Status = 3
}
export enum TagSection {
  Active = 0,
  Others = 1
}


