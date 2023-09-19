import { id } from '@swimlane/ngx-datatable';
import { data } from 'jquery';
import { Injectable } from '@angular/core';
import { AppUserAuth } from '../model/security/app-user.auth';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { EncounterClaim, FilterInvoice } from '../model/Accounts/invoice.model';
import { GetInvoiceDetailByDeviceDto } from '../model/Accounts/billing.model';
import moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class BillingService {
  presSelectedOrganization: number;
  presSelectedFacilities = [];
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}

  getPagedBills(month: number, year: number, FacilityId: number, pageNumb: number, pageSize: number) {
    return this.http.get(this.baseUrl + 'Billing/GetBills?Month=' + month + '&Year=' + year +
    '&FacilityId=' + FacilityId + '&PageNumber=' + pageNumb + '&PageSize=' + pageSize , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getInvoicesList(facilityIds: number | number[], orgId?:number, startDate?: string, endDate?: string) {
    if(!Array.isArray(facilityIds)){
      facilityIds = [facilityIds];
    }
    if(!startDate || !endDate){
      startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
      endDate = moment().format('YYYY-MM-DD');
    }
    return this.http.get(this.baseUrl + `Invoice/GetInvoicesByFacilityIds?facilityIds=${facilityIds}&startDate=${startDate}&endDate=${endDate}&organizationId=${orgId || 0}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateInvoicesPaymentStatus(facilityId: number) {
    return this.http.post(this.baseUrl + `Invoice/UpdateInvoicesPaymentStatus/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDemoPdf() {
    return this.http.get(this.baseUrl + `Demo/CreateDemoPdf`, { responseType: 'blob' });
  }
  GetEncounterClaimsByInvoiceId(invoiceId: number, filterInvoiceDto?: FilterInvoice) {
    let queryStr = '';
    if (filterInvoiceDto) {
      queryStr = `&CptCode=${filterInvoiceDto?.cptCode}&PaymentMode=${filterInvoiceDto?.paymentMode}&CaseStatus=${filterInvoiceDto?.caseStatus}&PaymentStatus=${filterInvoiceDto?.paymentStatus}&PatientResponseType=${filterInvoiceDto?.patientResponseType}&ServiceStartDate=${filterInvoiceDto.serviceStartDate}&ServiceEndDate=${filterInvoiceDto.serviceEndDate}`
    }
    return this.http.get(this.baseUrl + `Invoice/GetEncounterClaimsByInvoiceId?InvoiceId=${invoiceId}${queryStr}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
 
  PreviewInvoiceByFacilityId(facilityId: number, month: Number, year: number) {
    const pObj = {
      'facilityId': facilityId,
      'month': month,
      'year': year
    };
    return this.http.post(this.baseUrl + `Invoice/PreviewInvoiceByFacilityId`, pObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GenerateInvoiceByFacilityId(facilityId: number, monthId: number, yearId: number) {
    const pObj = {
      "facilityId": facilityId,
      "month": monthId,
      "year": yearId
    }
    return this.http.post(this.baseUrl + 'Invoice/GenerateInvoiceByFacilityId', pObj, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEncounterClaimsPDFByInvoiceId(inVoiceId: number) {
    return this.http.get(this.baseUrl + `Invoice/GetEncounterClaimsByInvoiceIdPdf/${inVoiceId}` , {
      responseType: 'blob'
    });
  }
  DownloadEncountersAuditData(monthId: number, yearId: number) {
    return this.http.get(this.baseUrl + `Invoice/DownloadEncountersAuditData?monthId=${monthId}&yearid=${yearId}` , {
      responseType: 'blob'
    }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadEncountersAuditDataByFacility(monthId: number, yearId: number, facilityId: number) {
    return this.http.get(this.baseUrl + `Invoice/DownloadEncountersAuditDataByFacilityId?monthId=${monthId}&yearid=${yearId}&facilityId=${facilityId}` , {
      responseType: 'blob'
    }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GenerateRPMEncounterClaims(month: number, year: number) {
    const filter = {
      month: month,
      year: year
    };
    // return this.http.post(this.baseUrl + `Invoice/GenerateRPMEncounterClaims`, filter, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddConfigureDeviceEncounterClaimAsync(patientId: number, facilityId: number) {
    const filter = {
      patientId: patientId,
      facilityId: facilityId
    };
    return this.http.post(this.baseUrl + `Invoice/AddConfigureDeviceEncounterClaim`, filter, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddInvoicePaymentLink(data: any) {
    return this.http.post(this.baseUrl + `Invoice/AddInvoicePaymentLink`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDefaultCPTCharges() {
    return this.http.get(this.baseUrl + `defaultCPTCharges`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCptCategoriesLookup() {
    return this.http.get(this.baseUrl + `CPTCodes/GetCptCategoriesLookup`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addDefaultCPTCharges(data: any) {
    return this.http.post(this.baseUrl + `defaultCPTCharges`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDefaultCPTChargesById(id: number) {
    return this.http.get(this.baseUrl + `defaultCPTCharges/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editDefaultCPTCharge(data: any) {
    return this.http.put(this.baseUrl + `defaultCPTCharges/${data.id}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  deleteDefaultCPTCharge(id: any) {
    return this.http.delete(this.baseUrl + `defaultCPTCharges/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

  syncFacilityClaimCharge() {
    return this.http.get(this.baseUrl + `facilityClaimCharges/SyncFacilityClaimCharges`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetInvoiceById(id: number) {
    return this.http.get(this.baseUrl + `Invoice/GetInvoiceById/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editfacilityClaimCharges(data: any) {
    return this.http.put(this.baseUrl + `facilityClaimCharges/${data.id}`, data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getfacilityClaimCharges(id: number) {
    return this.http.get(this.baseUrl + `facilityClaimCharges?facilityId=${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  verifyFacilityClaimCharge(id: number) {
    return this.http.put(this.baseUrl + `facilityClaimCharges/VerifyFacilityClaimCharge/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateEncounterClaim(encounterClaimDto: EncounterClaim) {
    return this.http.put(this.baseUrl + `Invoice/UpdateEncounterClaim`, encounterClaimDto,httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  } 
  getInvoiceDetailByDevice(data: GetInvoiceDetailByDeviceDto) {
    return this.http.get(this.baseUrl + `Invoice/GetDeviceChargesByInvoice?FacilityId=${data.facilityId}&Month=${data.month}&Year=${data.year}&Category=${data.category}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
