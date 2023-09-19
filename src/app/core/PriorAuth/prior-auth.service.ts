import { id } from '@swimlane/ngx-datatable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { PAPatientsScreenParamsDto, PriorAuthDto } from 'src/app/model/PriorAuth/prioAuth.model';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { SecurityService } from '../security/security.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PriorAuthService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetPriorAuthById(id1: number) {
    return this.http.get(this.baseUrl + `PriorAuths/${id1}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  PACaseTypes(facilityId: number) {
    return this.http.get(this.baseUrl + `PACaseTypes/GetPACaseTypesByFacilityId/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPriorAuthsByFacilityId(searchParams: PAPatientsScreenParamsDto) {
    return this.http.post(this.baseUrl + `PriorAuths/GetPriorAuthList`, searchParams , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));

    // ?PageNumber=${searchParams.PageNumber}&PageSize=${searchParams.PageSize}&SearchParam=${searchParams.SearchParam}&CaseStatus=${searchParams.caseStatus}&ReqStatus=
    // ${searchParams.reqStatus}&CaseTypeId=${searchParams.caseTypeIds}&RequestingPhysicianId=${searchParams.RequestingPhysicianId}&FacilityUserId=${searchParams.FacilityUserId}
    // &FacilityId=${searchParams.FacilityId}&AssignedToId=${searchParams.assignedToId}&FromRequestDate=${searchParams.fromRequestDate}&ToRequestDate=${searchParams.toRequestDate}
    // &SortBy=${searchParams.sortBy}&SortOrder=${searchParams.sortOrder}
  }
  AddPriorAuth(data: PriorAuthDto) {
    const mData = {} as any;
    Object.assign(mData, data);
    if (mData.paCaseStepId === -1) {
      mData.paCaseStepId = null;
    }
    return this.http.post(this.baseUrl + `PriorAuths`, mData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPADocument(title: number, priorAuthId: number) {
    const data = {
      title: title,
      priorAuthId: priorAuthId
    };
    return this.http.post(this.baseUrl + `PriorAuths/AddPADocument`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPADocumentOnError(docId: number) {
    return this.http.post(this.baseUrl + `PriorAuths/AddPADocumentOnError/${docId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePADocument(docId: number) {
    return this.http.delete(this.baseUrl + `PriorAuths/DeletePADocument/${docId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePriorAuth(id: number) {
    return this.http.delete(this.baseUrl + `PriorAuths/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPriorAuth(data: PriorAuthDto) {
    const mData = {} as any;
    Object.assign(mData, data);
    if (mData.paCaseStepId === -1) {
      mData.paCaseStepId = null;
    }
    return this.http.put(this.baseUrl + `PriorAuths/${data.id}`, mData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPACaseTypes(data: any) {
    return this.http.post(this.baseUrl + `PACaseTypes`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPACaseTypes(data: any) {
    return this.http.put(this.baseUrl + `PACaseTypes/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePACaseTypes(dId: number) {
    return this.http.delete(this.baseUrl + `PACaseTypes/${dId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPACaseSteps(data: any) {
    return this.http.post(this.baseUrl + `PACaseSteps`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPACaseSteps(data: any) {
    return this.http.put(this.baseUrl + `PACaseSteps/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePACaseSteps(dId: number) {
    return this.http.delete(this.baseUrl + `PACaseSteps/${dId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
