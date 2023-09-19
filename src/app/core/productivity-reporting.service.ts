import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GetPRDataParam } from '../model/productivity.model';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';




const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductivityReportingService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  // securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}

  GetProductivityReport(data: GetPRDataParam) {
    let idsList = '';
    idsList = data.facilityUserIds.filter(x => x !== 0).toString();
    let facilityIdsList = '';
    facilityIdsList = data.facilityIds.filter(x => x !== -1).toString();
    return this.http.get(this.baseUrl + `ProductivityReport?From=${data.from}&To=${data.to}&FacilityIds=${facilityIdsList}&FacilityUserIds=${idsList}&SortBy=${data.sortBy}&SortOrder=${data.sortOrder}&IsExcelDownload=false`, httpOptions )
    .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getProductivityReportExcelFile(data: GetPRDataParam) {
    let idsList = '';
    idsList = data.facilityUserIds.filter(x => x !== 0).toString();
    let facilityIdsList = '';
    facilityIdsList = data.facilityIds.filter(x => x !== -1).toString();
    return this.http.get(this.baseUrl + `ProductivityReport/GetProductivityReportExcelFile?From=${data.from}&To=${data.to}&FacilityIds=${facilityIdsList}&FacilityUserIds=${idsList}&SortBy=${data.sortBy}&SortOrder=${data.sortOrder}&Credit=${data.PRCredit}&EncounterType=${data.encounterType}&IsExcelDownload=true`,{ responseType: 'blob' }) .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  checkPrPaymentValidity(id){
    return this.http
      .get(
        this.baseUrl + `ProductivityReport/CheckPrPaymentValidity/${id}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  markAsPaid(id){
    return this.http
      .post(
        this.baseUrl + `ProductivityReport/MarkAsPaid/${id}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
