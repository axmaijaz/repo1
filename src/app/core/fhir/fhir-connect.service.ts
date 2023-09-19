import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { SecurityService } from '../security/security.service';


const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
@Injectable({
  providedIn: 'root'
})
export class FhirConnectService {

  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}

  SmartOnFhirLogin(data: any) {
    return this.http
      .post(this.baseUrl + "SmartOnFhir/Login", data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
