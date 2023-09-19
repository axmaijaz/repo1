// import { data } from 'jquery';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppUserAuth } from '../model/security/app-user.auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { BhiPatientsScreenParams, BhiEncounterDto, BhiMonthlyStatusDto } from '../model/Bhi/bhi.model';
import { BhiMonthEnum } from '../Enums/bhi.enum';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //
  })
};
const httpOptionsForPlainText = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',

  })
};

@Injectable({
  providedIn: 'root'
})
export class BhiService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}

  // getPagedBills(month: number, year: number, FacilityId: number, pageNumb: number, pageSize: number) {
  //   return this.http.get(this.baseUrl + 'Billing/GetBills?Month=' + month + '&Year=' + year +
  //   '&FacilityId=' + FacilityId + '&PageNumber=' + pageNumb + '&PageSize=' + pageSize , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  getBhiFilterPatientsList2(data: BhiPatientsScreenParams) {
    return this.http
      .get(
        this.baseUrl +
          'Bhi/GetPatients2?PageNumber=' +
          data.pageNumber +
          '&PageSize=' +
          data.pageSize +
          '&CustomListId=' +
          data.customListId +
          '&BhiStatus=' +
          data.bhiStatus +
          '&BhiCareManagerId=' +
          data.bhiCareManagerId +
          '&PsychiatristId=' +
          data.PsychiatristId +
          '&FacilityUserId=' +
          data.facilityUserId +
          '&FacilityId=' +
          data.facilityId +
          '&DiseaseId=' +
          data.diseaseId +
          '&SortBy=' +
          data.sortBy +
          '&SortOrder=' +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          '&SearchParam=' +
          data.searchParam +
          '&ServiceMonth=' +
          data.serviceMonth +
          '&ShowAll=' +
          data.showAll +
          '&ServiceYear=' +
          data.serviceYear +
          '&BhiEncounterTime=' +
          data.BhiEncounterTime+
          '&Assigned=' +
          data.Assigned
          +
          '&BillingProviderId=' +
          data.billingProviderId
          +
          '&BhiMonthlyStatus=' +
          data.bhiMonthlyStatus+
          '&DateAssignedFrom=' +
          data.DateAssignedFrom +
          '&DateAssignedTo=' +
          data.DateAssignedTo
          +
          '&DiseaseIds=' +
          data['chronicDiseasesIds']
          ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  GetbhiDashboard(data: BhiPatientsScreenParams) {
    const queryParam =  '' +
          // 'PageNumber=' + data.pageNumber +
          // '&PageSize=' +
          // data.pageSize +
          '&CustomListId=' +
          data.customListId +
          '&BhiStatus=' +
          data.bhiStatus +
          '&BhiCareManagerId=' +
          data.bhiCareManagerId +
          '&PsychiatristId=' +
          data.PsychiatristId +
          '&FacilityUserId=' +
          data.facilityUserId +
          '&FacilityId=' +
          data.facilityId +
          '&DiseaseId=' +
          data.diseaseId +
          '&SortBy=' +
          data.sortBy +
          '&SortOrder=' +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          '&SearchParam=' +
          data.searchParam +
          '&ServiceMonth=' +
          data.serviceMonth +
          '&ShowAll=' +
          data.showAll +
          '&ServiceYear=' +
          data.serviceYear;
    return this.http.get(this.baseUrl + `Bhi/GetbhiDashboard?${queryParam}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiChronicDiseaseCodes() {
    return this.http.get(this.baseUrl + `Bhi/GetBhiChronicDiseaseCodes` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityUsers(facilityId: number, roleName: string){
    return this.http.get(this.baseUrl + `Facility/GetFacilityUsers/${facilityId}?roleName=${roleName}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddBhiEncounter(data: BhiEncounterDto) {
    return this.http.post(this.baseUrl + `Bhi/AddBhiEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditBhiCarePlan(body: any) {
    return this.http.put(this.baseUrl + `Bhi/EditBhiCarePlan`, body , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditBhiEncounter(data: BhiEncounterDto) {
    return this.http.put(this.baseUrl + `Bhi/EditBhiEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteBhiDocument(data: number) {
    return this.http.delete(this.baseUrl + `Bhi/DeleteBhiDocument/${data}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteBhiEncounter(data: number) {
    return this.http.delete(this.baseUrl + `Bhi/DeleteBhiEncounter/${data}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiEncountersByPatientId(patientId: number,monthId: number, yearId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiEncountersByPatientId/${patientId}?monthId=${monthId}&yearId=${yearId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiEncountersDurationByPatientId(patientId: number,monthId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiEncountersDurationByPatientId/${patientId}/${monthId}`);
  }
  AssignBhiData(data: any) {
    return this.http.put(this.baseUrl + `Bhi/AssignBhiData`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiCarePlan(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiCarePlan/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiDocumentsByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiDocumentsByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiCarePlanPdf(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiCarePlanPdf/${patientId}` , {
      responseType: 'blob'
    });
  }
  AddBhiDocument(data: any) {
    return this.http.post(this.baseUrl + `Bhi/AddBhiDocument`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddBhiDocumentError(docId: number) {
    return this.http.post(this.baseUrl + `Bhi/AddBhiDocumentError/${docId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetBhiPatientsDateAssigned(dateAssign,ids: any) {
    let data = {
      ids,
      dateAssign
    }
    return this.http.put(this.baseUrl + `Bhi/SetBhiPatientsDateAssigned`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateBhiMonthlyStatus(bhiMonthlyStatusDto: BhiMonthlyStatusDto) {
    return this.http.put(this.baseUrl + `Bhi/EditPatientBhiMonthlyStatus`, bhiMonthlyStatusDto, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiCocmMonth(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiCocmMonth/${patientId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetBhiCocmMonth(patientId: number, bhiMonth: BhiMonthEnum) {
    return this.http.put(this.baseUrl + `Bhi/SetBhiCocmMonth`, { patientId, bhiMonth }, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetBhiMsQualityChecked(patientId){
    return this.http.put(this.baseUrl + `Bhi/SetBhiMsQualityChecked/${patientId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiMsQualityChecked(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiMsQualityChecked/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
