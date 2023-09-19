import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';
import { AddSurgicalHDto } from '../model/SurgicalHistory/surgicalHistory.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class SurgicalHistoryService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetSurgicalSystems() {
    return this.http.get(this.baseUrl + `SurgicalHistories/GetSurgicalSystems` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSurgicalProcedures(systemId: number) {
    return this.http.get(this.baseUrl + `SurgicalHistories/GetSurgicalProcedures/${systemId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSurgicalHistoriesByPatientId(patientId: number, awId?: number) {
    let urlString = 'SurgicalHistories/GetSurgicalHistoriesByPatientId/';
    if (awId) {
      urlString = 'SurgicalHistories/GetAWSurgicalHistories/';
      patientId = awId;
    }
    return this.http.get(this.baseUrl + `${urlString}${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditPatientSurgicalHistory(data: AddSurgicalHDto) {
    return this.http.post(this.baseUrl + `SurgicalHistories/AddEditPatientSurgicalHistory`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientImmunization(surgeryId: number) {
    return this.http.post(this.baseUrl + `SurgicalHistories/DeleteSurgicalHistoryById/${surgeryId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
