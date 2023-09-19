import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';
import { EditAMScreeningDto, EditAMCounsellingDto } from '../model/pcm/pcm-alcohol.model';
import { AddInsurancePlanDto } from '../model/pcm/payers.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetAllPayers(parm: string) {
    return this.http.get(this.baseUrl + `Payers/GetAllPayers?searchString=${parm}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetInsurancePlanPatientCount(id: number) {
    return this.http.get(this.baseUrl + `Payers/GetInsurancePlanPatients/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllCareGaps() {
    return this.http.get(this.baseUrl + `Payers/GetAllCareGaps` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetGapsByFacilityId(facilityId: number) {
    if (!facilityId) {
      facilityId = 0;
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetFacilityGapsIds/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

  EditFacilityGaps(data: any) {
    return this.http.put(this.baseUrl + `Payers/EditFacilityGaps`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignPatientsToInsurancePlan(data: any) {
    return this.http.put(this.baseUrl + `Payers/AssignPatientsToInsurancePlan`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetInsurancePlansByFacilityId(facilityId: number) {
    if (!facilityId) {
      facilityId = 0;
    }
    return this.http.get(this.baseUrl + `Payers/GetInsurancePlansByFacilityId/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditInsurancePlan(data: AddInsurancePlanDto) {
    return this.http.post(this.baseUrl + `Payers/AddEditInsurancePlan`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteInsurancePlan(id: number) {
    return this.http.delete(this.baseUrl + `Payers/DeleteInsurancePlan/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
