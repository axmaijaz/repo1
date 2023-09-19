import { Injectable } from '@angular/core';
import { FilterPatient } from '../model/Patient/patient.model';

@Injectable({
  providedIn: 'root'
})
export class StatementManagementService {
  IsSetDataTable = false;
  setTableData: any;
  filterPatientData= new FilterPatient();
  counterStartingTime: string;
  timerStart: boolean;
  date: string;
  pageNumber: number;
  // quickNotesPatientId: number;
  constructor() { }
  // fieldsManagement(data: FilterPatient) {
  // return  this.filterPatientData = data;

  // }
}
