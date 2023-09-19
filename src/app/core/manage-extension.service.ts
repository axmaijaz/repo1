import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SecurityService } from './security/security.service';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { ExtClient } from '../extension-manager/extensionManager.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class ManageExtensionService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService,
    private httpErrorService: HttpErrorHandlerService){}
    GetEmrList() {
    return this.http.get(this.baseUrl + 'Facility/GetEmrList', httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    }
    AddEditEmrList(emrData) {
    return this.http.put(this.baseUrl + 'Facility/AddEditEmrList',emrData, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    }
    GetAllExtClients(getAll = false) {
    return this.http.get(this.baseUrl + `ExtClients/GetAllExtClients?getAll=${getAll}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    }
    DeleteExtClient(rId: number) {
    return this.http.delete(this.baseUrl + `ExtClients/DeleteExtClient/${rId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
    }
    AddEditExtClient(data: ExtClient) {
    return this.http.post(this.baseUrl + 'ExtClients/AddEditExtClient', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
