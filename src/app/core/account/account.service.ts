import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  Get2FAInfoPdf() {
    return this.http.get(this.baseUrl + `Account/Get2FAInfoPdf` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  IsSMSOrEmailVerified(email: string) {
    return this.http.post(this.baseUrl + `Account/IsSMSOrEmailVerified?userName=${email}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

}
