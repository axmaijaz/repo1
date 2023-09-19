export class SurgicalSystemDto {
  id: number;
  name: string;
}
export class SurgicalProceduresDto {
  id: number;
  name: string;
  systemId: number;
}
export class AddSurgicalHDto {
  id = 0;
  dateOperated: Date | string;
  surgicalProcedureId: number;
  surgeonName: string;
  notes: string;
  patientId: number;
}
export class SHListDto {
  id: number;
  dateOperated: Date | string;
  surgicalSystemId: number;
  surgicalSystemName: string;
  surgicalProcedureId: number;
  surgeonName: string;
  procedure?: string;
  notes?: string;
  createdOn: Date;
  createdUser: string;
  patientId: number;
}
