import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class MrAdminService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  selectedMRType = 'ccm';
  mrTypeChanges = new Subject();
  // let baseUrl = this.baseUrl.replace('api/', 'VMRProblemMvc');
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
  ) {}
  GetMRProblemsByTypeId(patientId: number, typeId: number) {
    return this.http.get(this.baseUrl + `MonthlyReview/GetMRProblemsByTypeId?patientId=${patientId}&typeId=${typeId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTypes() {
    return this.http.get(this.baseUrl + `MonthlyReview/GetTypes` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAssessmentDataByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `MonthlyReview/GetAssessmentDataByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyReviewPdf(patientId: number, includeCarePlan = false) {
    debugger
    return this.http.get(this.baseUrl + `MonthlyReview/GetMonthlyReviewPdf/${patientId}?includeCarePlan=${includeCarePlan}` , { responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyReviewPatientPdf(patientId: number) {
    return this.http.get(this.baseUrl + `MonthlyReview/GetMonthlyReviewPatientPdf/${patientId}` , { responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadCarePlanPdfByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `CarePlanMaster/DownloadCarePlanPdfByPatientId/${patientId}` , { responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyReviewData(patientId: number, month, year) {
    return this.http.get(this.baseUrl + `MonthlyReview/GetMonthlyReviewData/${patientId}?month=${month}&year=${year}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditMRPatientIntervention(data: any) {
    return this.http.put(this.baseUrl + `MonthlyReview/EditMRPatientIntervention`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditMRPatientGoal(data: any) {
    return this.http.put(this.baseUrl + `MonthlyReview/EditMRPatientGoal`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetMsQualityChecked(encounterId: number) {
    return this.http.put(this.baseUrl + `MonthlyReview/SetMsQualityChecked/${encounterId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAssessmentPatientQuestion(data: any) {
    return this.http.put(this.baseUrl + `MonthlyReview/EditAssessmentPatientQuestion`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IncrementMRVersion() {
    return this.http.put(this.baseUrl + `MonthlyReview/IncrementMRVersion`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

}
