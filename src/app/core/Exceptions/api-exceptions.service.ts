import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { CreateClientExceptionLoggerDto } from './../../model/Exception/Exception.model';
import { SecurityService } from '../security/security.service';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
const httpOptionsForPlainText = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',


  }),
  responseType: 'text'
};

@Injectable({
  providedIn: 'root',
})
export class ApiExceptionsService {
  private http2: HttpClient;
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private handler: HttpBackend,
    ) {
      this.http2 = new HttpClient(handler);
    }
  LoggFrontendException(objdata: CreateClientExceptionLoggerDto) {
    return this.http
      .post(this.baseUrl + 'FrontEndExceptions', objdata, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }


  GetExceptionList() {
    return this.http
      .get(this.baseUrl + 'General/GetExceptions', httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

  TryApi(httpMethod: string, path: string, queryString: string, body: string, tokenRes: AppUserAuth) {
    const httpOptions12 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenRes.bearerToken}`,
      }),
    };
    const hostUrl = 'http://localhost:5000';
    switch (httpMethod) {
      case 'GET': {
        return this.http2.get(hostUrl + path + queryString, httpOptions12).pipe(catchError(this.httpErrorService.handleHttpError));
      }
      case 'PUT': {
        let obj = {};
        if (body) {
          obj = JSON.parse(body);
        }
        return this.http2.put(hostUrl + path + queryString, obj, httpOptions12).pipe(catchError(this.httpErrorService.handleHttpError));
      }
      case 'POST': {let obj = {};
        if (body) {
          obj = JSON.parse(body);
        }
        return this.http2.post(hostUrl + path + queryString, obj, httpOptions12).pipe(catchError(this.httpErrorService.handleHttpError));
      }
      case 'DELETE': {
        return this.http2.delete(hostUrl + path + queryString, httpOptions12).pipe(catchError(this.httpErrorService.handleHttpError));
      }
    }
  }
  DeleteException(id: number) {
    return this.http
      .delete(this.baseUrl + `Exceptions/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetClientExceptionList() {
    return this.http
      .get(this.baseUrl + 'FrontEndExceptions', httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetHangFire() {
    let baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl :  environment.baseUrl;
    baseUrl = baseUrl.replace('api/', 'hangfire');
    return this.http.get(baseUrl, { responseType: 'blob'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
