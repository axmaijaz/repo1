import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BulkDateAssignedParamDto, PRCMDashboardParamsDto, PRCMEncounterDto, PRCMPatientsScreenParams } from '../model/Prcm/Prcm.model';
import { AppUserAuth } from '../model/security/app-user.auth';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const httpOptionsForPlainText = {
  headers: new HttpHeaders({
    'Content-Type': 'text' as 'json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PRCMService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  // securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}

  // getPagedBills(month: number, year: number, FacilityId: number, pageNumb: number, pageSize: number) {
  //   return this.http.get(this.baseUrl + 'Billing/GetBills?Month=' + month + '&Year=' + year +
  //   '&FacilityId=' + FacilityId + '&PageNumber=' + pageNumb + '&PageSize=' + pageSize , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  getPRCMFilterPatientsList2(data: PRCMPatientsScreenParams) {
    if (!data.diseaseId) {
      data.diseaseId = '' as any;
    }
    const age = data.age === '0'? '' : data.age;
    const cronicCondition = data.dashboardConditionsIds.filter(x => x !== '0');
    const cronicCode = data.dashboardDiseaseIds.filter(x => x !== '0');
       return this.http
      .get(
        this.baseUrl +
          "End_PrCM/GetPatients2?PageNumber=" +
          data.pageNumber +
          "&PageSize=" +
          data.pageSize +
          "&CustomListId=" +
          data.customListId +
          "&PrCMStatus=" +
          data.prCMStatus +
          "&PrCMCareCoordinatorId=" +
          data.prCMCareCoordinatorId +
          "&PrCMSpecialistBillerId=" +
          data.prCMSpecialistBillerId  +
          "&Assigned=" +
          data.assigned  +
          "&PatientStatus=" +
          data.patientStatus  +
          "&FacilityUserId=" +
          data.facilityUserId +
          "&FacilityId=" +
          data.facilityId +
          "&DiseaseIds=" +
          data.diseaseId +
          "&SortBy=" +
          data.sortBy +
          "&DateAssignedTo=" +
          data.dateAssignedTo +
          "&DateAssignedFrom=" +
          data.dateAssignedFrom +
          "&SortOrder=" +
          data.sortOrder +
          // tslint:disable-next-line: max-line-length
          "&SearchParam=" +
          data.searchParam +
          "&ServiceMonth=" +
          data.serviceMonth +
          "&ShowAll=" +
          data.showAll +
          "&ServiceYear=" +
          data.serviceYear +
          "&Section=" +
          data.section +
          "&FilteredMonth=" +
          data.filteredMonth +
          "&CareFacilitatorId=" +
          data.prCMCareFacilitatorId +
          "&DashboardDiseaseIds=" +
          cronicCode +
          "&DashboardConditionsIds=" +
          cronicCondition +
          "&PayerIds=" +
          data.payerIds +
          "&EncounterDateFrom=" +
          data.encounterDateFrom +
          "&EncounterDateTo=" +
          data.encounterDateTo +
          "&Age=" +
          age +
          "&Duration=" +
          data.duration,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPrCMDateAssigned(patientId: number, date: string , facilityId: number) {
    const data = {
      patientId: patientId,
      dateAssigned: date,
      facilityId: facilityId
    };
    return this.http
      .put(this.baseUrl + "End_PrCM/EditPrCMDateAssigned", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyPatientsPRCMData(data: PRCMDashboardParamsDto) {
    return this.http.get(this.baseUrl + `End_PrCM/GetMonthlyPatientsPRCMData?FacilityId=${data.facilityId}&FilteredMonth=${data.filteredMonth}`, httpOptions ).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientsPRCMData(patientId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPatientsPRCMData/${patientId}`, httpOptions ).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPRCMChronicDiseaseCodes() {
    return this.http.get(this.baseUrl + `End_PrCM/GetPrCMChronicDiseaseCodes` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityUsers(facilityId: number, roleName: string){
    return this.http.get(this.baseUrl + `Facility/GetFacilityUsers/${facilityId}?roleName=${roleName}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPRCMEncounter(data: PRCMEncounterDto) {
    return this.http.post(this.baseUrl + `End_PrCM/AddPrCMEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPRCMCarePlan(body: any) {
    return this.http.put(this.baseUrl + `End_PrCM/EditPrCMCarePlan`, body , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPRCMEncounter(data: PRCMEncounterDto) {
    return this.http.put(this.baseUrl + `End_PrCM/EditPrCMEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePRCMDocument(data: number) {
    return this.http.delete(this.baseUrl + `End_PrCM/DeletePrCMDocument/${data}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPRCMEncountersByPatientId(patientId: number,monthId: number, yearId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPrCMEncountersByPatientId/${patientId}?monthId=${monthId}&yearId=${yearId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignPRCMData(data: any) {
    return this.http.put(this.baseUrl + `End_PrCM/AssignPrCMData`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPRCMCarePlan(patientId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPRCMCarePlan/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPrCMPatientsChronicDiseases(patientId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPrCMPatientsChronicDiseases/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPRCMDocumentsByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPrCMDocumentsByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPRCMCarePlanPdf(patientId: number) {
    return this.http.get(this.baseUrl + `End_PrCM/GetPrCMCarePlanPdf/${patientId}` , {
      responseType: "blob"
    });
  }
  AddPRCMDocument(data: any) {
    return this.http.post(this.baseUrl + `End_PrCM/AddPrCMDocument`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPRCMDocumentError(docId: number) {
    return this.http.post(this.baseUrl + `End_PrCM/AddPrCMDocumentError/${docId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  BulkDateAssignedPrCM(data: BulkDateAssignedParamDto) {
    return this.http
      .put(
        this.baseUrl + `End_PrCM/BulkDateAssignedPrCM`,
        data,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
