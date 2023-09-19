import { CreateAdminDto, AddAdminDto } from './../administration.model';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { catchError } from 'rxjs/operators';
import { AppAdminDto } from '../administration.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class AppAdminService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}

  GetAppAdmins() {
    return this.http.get(this.baseUrl + `Admin/GetAppAdmins` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAppAdminById(appAdminId: number) {
    return this.http.get(this.baseUrl + `Admin/GetAppAdminById/${appAdminId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateUser(data: AddAdminDto) {
    return this.http.post(this.baseUrl + `Admin/CreateUser`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetAppAdminInActive(id: number) {
    return this.http.post(this.baseUrl + `Admin/SetAppAdminInActive/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetAppAdminActive(id: number) {
    return this.http.post(this.baseUrl + `Admin/SetAppAdminActive/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAppAdmin(data: CreateAdminDto) {
    return this.http.put(this.baseUrl + `Admin/EditAppAdmin/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteAppAdminUser(id: number) {
    return this.http.delete(this.baseUrl + `Admin/${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAppStatistics() {
    return this.http.get(this.baseUrl + 'General/GetAppStatistics' , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
