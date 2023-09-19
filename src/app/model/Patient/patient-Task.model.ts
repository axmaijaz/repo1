export class PatientTaskDto {
  // id = 0;
  // patientTaskType: string;
  // patientTaskPriority: string;
  // patientTaskStatus = 'Created';
  // action: string;
  // notes: string;
  // assignedToId?: number;
  // assignedToName: string;
  // completedById?: number;
  // completedByName: string;
  // enteredByName: string;
  // patientId = 0;
  id = 0;
  patientTaskType: string;
  patientTaskPriority: string;
  patientTaskStatus = 'Created';
  action: string;
  notes: string;
  assignedToId: number;
  assignedToName: string;
  completedById: number;
  completedByName: string;
  enteredByName: string;
  patientId = 0;
  facilityId: number;
}
export enum PatientTaskType {
  Type1 = 0,
  Type2 = 1,
  Type3 = 2,
}
