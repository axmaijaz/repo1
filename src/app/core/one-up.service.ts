import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';
import { AddDeviceDto } from '../model/deviceModels/device.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class OneUpService {

  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetSupportedSystems(search: string, stateCode: string) {
    return this.http.get(this.baseUrl + `OneUpHealth/GetSupportedSystems?search=${search}&stateCode=${stateCode}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SearchSupportedSystems(searchTerm: string) {
    return this.http.get(this.baseUrl + `OneUpHealth/SearchSupportedSystems?search=${searchTerm}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateOneUpUser(patientId: number) {
    return this.http.post(this.baseUrl + `OneUpHealth/CreateOneUpUser/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientSystemCode(data: any) {
    return this.http.post(this.baseUrl + `OneUpHealth/AddPatientSystemCode`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RemovePatientSystemCode(data: any) {
    return this.http.post(this.baseUrl + `OneUpHealth/RemovePatientSystemCode`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCode(patientId: number, systemCode: number) {
    return this.http.get(this.baseUrl + `OneUpHealth/GetCode/${patientId}?systemCode=${systemCode}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetConnectedHealthSystemsByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `OneUpHealth/GetConnectedHealthSystemsByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}

