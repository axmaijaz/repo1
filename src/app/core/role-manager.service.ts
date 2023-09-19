import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class RoleManagerService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  getAllRoles() {
    return this.http.get(this.baseUrl + 'Roles/GetAllRoles', httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRolesByAppUserId(appUserId: string) {
    return this.http.get(this.baseUrl + `Roles/GetUserRoles/${appUserId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getClaimsByRoles(id: number) {
    return this.http.get(this.baseUrl + 'Roles/GetClaimsbyRoleId/' + id, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addNewRole(name: string) {
    const data =  {
      roleName: name
    };
    return this.http.post(this.baseUrl + 'Roles/AddNewRole' , data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addNewCategory(data: any) {
    return this.http.post(this.baseUrl + 'ClaimCategories' , data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addRoleClaims(data: any) {
    return this.http.post(this.baseUrl + 'Roles/AddRoleClaims' , data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  assignUserRoles(data: any) {
    return this.http.post(this.baseUrl + 'Roles/AddUserRoles' , data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getClaims(roleTypeId: number) {
    return this.http.get(this.baseUrl + `AppClaims?roleTypeId=${roleTypeId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRoleTypes() {
    return this.http.get(this.baseUrl + `Roles/GetRoleTypes`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getRolesbyRoleType(roleTypeId: number) {
    return this.http.get(this.baseUrl + `Roles/GetRolesByRoleType/${roleTypeId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ClaimCategories() {
    return this.http.get(this.baseUrl + `ClaimCategories`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddClaimsToCategory(data: any) {
    return this.http.put(this.baseUrl + `AppClaims/AddClaimsToCategory`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddClaim(data: any) {
    return this.http.post(this.baseUrl + `AppClaims`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editClaim(data: any) {
    return this.http.put(this.baseUrl + `AppClaims/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRolesByClaimType(claimType) {
    return this.http.get(this.baseUrl + `Roles/GetRolesByClaimType?claimType=${claimType}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
