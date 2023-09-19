import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddEditCustomListDto, AssignPatientsToCustomListDto, RemovePatientsToCustomListDto } from '../model/custome-list.model';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class CustomeListService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor( private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient,
    private securityService: SecurityService,
    private handler: HttpBackend) { }
    GetCustomListColums() {
      return this.http.get(this.baseUrl + `CustomLists/GetCustomListColums` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    GetCustomListsByFacilityUserId(facilityUserId: number) {
      let facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
      if (!facilityId) {
       facilityId = 0;
      }
      return this.http.get(this.baseUrl + `CustomLists/GetCustomListsByFacilityUserId/${facilityUserId}?facilityId=${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    GetCustomListData(listId: number) {
      return this.http.get(this.baseUrl + `CustomLists/GetCustomListData/${listId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    RemovePatientsFromList(data: RemovePatientsToCustomListDto) {
      return this.http.put(this.baseUrl + `CustomLists/RemovePatientsFromList`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    DeleteCustomList(id: number) {
      return this.http.delete(this.baseUrl + `CustomLists/DeleteCustomList/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    AddPatientsToList(data: AssignPatientsToCustomListDto, replace = false) {
      data['replace'] = replace;
      return this.http.put(this.baseUrl + `CustomLists/AddPatientsToList`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    AddEditCustomList(data: AddEditCustomListDto) {
      let facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
      if (!facilityId) {
       facilityId = 0;
      }
      data.facilityId = facilityId;
      return this.http.put(this.baseUrl + `CustomLists/AddEditCustomList`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
}
