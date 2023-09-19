import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddFamilyHistoryDto, FamilyHistoryListDto } from '../model/FamilyHistoryDtos/familyHistory.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class FamilyHistoryService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetFamilyHistory(patientId: number, awId?: number) {
    let urlString = 'FamilyHistory/GetFamilyHistory/';
    if (awId) {
      urlString = 'FamilyHistory/GetAWFamilyHistories/';
      patientId = awId;
    }
    return this.http.get(this.baseUrl + `${urlString}${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFamilyHistoryLookupData() {
    return this.http.get(this.baseUrl + `FamilyHistory/GetFamilyHistoryLookupData` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddFamilyHistory(fHistory: AddFamilyHistoryDto) {
    return this.http.put(this.baseUrl + `FamilyHistory/AddFamilyHistory`, fHistory , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditFamilyHistory(fHistory: FamilyHistoryListDto) {
    return this.http.put(this.baseUrl + `FamilyHistory/EditFamilyHistory`, fHistory , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteFamilyHistory(fHistoryId: number) {
    return this.http.delete(this.baseUrl + `FamilyHistory/DeleteFamilyHistory/${fHistoryId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // EditFamilyHistory( fHistory: FamilyHistoryDto) {
  //   return this.http.put(this.baseUrl + `FamilyHistory/EditFamilyHistory`, fHistory , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
}
