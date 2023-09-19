import { data } from 'jquery';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ReportsFilterDto } from '../model/analytic.model';
import { DatePipe } from '@angular/common';
 const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AnalyticService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  getSales() {
    // return sales;
}
  constructor( private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    public datepipe: DatePipe ) { }
    getCharges(startDate: string, endDate: string, organizationId: number, facilityId: number, filterBy: string, billingProviderId: number) {
      return new Promise(resolve => {
        startDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
      endDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
       this.http.get(this.baseUrl + `Charges/NORTHERN ARIZONA MEDICAL GROUP/${organizationId}/${facilityId}/${startDate}/${endDate}/${filterBy}/${billingProviderId}`).subscribe(data => {
        resolve(data);
        // 2019-01-01/2019-01-05/CreatedDate
            });
            // CreatedDate
            // LastModifiedDate
            // PostingDate
            // PrimaryInsurancePaymentPostingDate
      });
    }



    DemoGetChargesReport(startDate: string, endDate: string, organizationId: number, facilityId: number, filterBy: string, billingProviderId: number) {
        startDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
      endDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
      return this.http.get(this.baseUrl + `ReportTest/GetChargesReport/NORTHERN ARIZONA MEDICAL GROUP/
      ${organizationId}/${facilityId}/${startDate}/${endDate}/${filterBy}/${billingProviderId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
    GetChargesReport(startDate: string, endDate: string, organizationId: number, facilityId: number, filterBy: string, billingProviderId: number) {
        startDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
      endDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
      return this.http.get(this.baseUrl + `Charges/GetChargesReport/NORTHERN ARIZONA MEDICAL GROUP/${organizationId}/${facilityId}/${startDate}/${endDate}/${filterBy}/${billingProviderId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }

    GetAncillaryPaymentReport(startDate: string, endDate: string, organizationId: number, facilityId: number, filterBy: string, billingProviderId: number) {
      startDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
      endDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
      return this.http.get(this.baseUrl + `Charges/GetAncillaryPaymentReport/NORTHERN ARIZONA MEDICAL GROUP/${organizationId}/${facilityId}/${startDate}/${endDate}/${filterBy}/${billingProviderId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     }
     GetSchedulingPaymentReport(startDate: string, endDate: string, organizationId: number, facilityId: number, filterBy: string, billingProviderId: number) {
      startDate = this.datepipe.transform(startDate, "yyyy-MM-dd");
      endDate = this.datepipe.transform(endDate, "yyyy-MM-dd");
      return this.http.get(this.baseUrl + `Charges/GetSchedulingPaymentReport/NORTHERN ARIZONA MEDICAL GROUP/${organizationId}/${facilityId}/${startDate}/${endDate}/${filterBy}/${billingProviderId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     }


    GetChargePaymentSummary(data: ReportsFilterDto) {
    //  return this.http.get(this.baseUrl + `Charges/GetChargePaymentSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/46` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     return this.http.get(this.baseUrl + `Charges/GetChargePaymentSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/${data.billingProviderId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }

    // Charges/GetChargePaymentSummary
    GetChargeOverallSummary(data: ReportsFilterDto) {
      // return this.http.get(this.baseUrl + `Charges/GetChargeOverallSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.filterBy}/46`
      //  , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
      return this.http.get(this.baseUrl + `Charges/GetChargeOverallSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.filterBy}/${data.billingProviderId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     }
     GetChargeCollectedSummary(data: ReportsFilterDto) {
      // return this.http.get(this.baseUrl + `Charges/GetChargeCollectedSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/46` ,
      return this.http.get(this.baseUrl + `Charges/GetChargeCollectedSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/${data.billingProviderId}` ,
      httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     }
     GetChargeClaimSummary(data: ReportsFilterDto) {
      // return this.http.get(this.baseUrl + `Charges/GetChargeClaimSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/46` ,
      return this.http.get(this.baseUrl + `Charges/GetChargeClaimSummary/NORTHERN ARIZONA MEDICAL GROUP/${data.year}/${data.lastMonth}/${data.lastQuarter}/${data.filterBy}/${data.duration}/${data.billingProviderId}` ,
       httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
     }
     GetFacilityUsers(facilityId: number, roleName: string){
      return this.http.get(this.baseUrl + `Facility/GetFacilityUsers/${facilityId}?roleName=${roleName}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
    }
}
