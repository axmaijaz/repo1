import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginWithAthenaAssertionDto, SubmitClaimDto } from '../model/EmrConnect/emr-connect.model';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from 'src/app/core/security/security.service';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class EmrConnectService {
  private baseUrl = localStorage.getItem("switchLocal")
  ? environment.localBaseUrl
  : environment.baseUrl;
  private http2: HttpClient;
  constructor(
    private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient,
    private handler: HttpBackend,
    private securityService: SecurityService,
  ) {
    this.http2 = new HttpClient(handler);
  }

  LoginWithAthenaAssertion(obj: LoginWithAthenaAssertionDto) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${obj.token}`,
      }),
    };
    return this.http2
      .post(this.baseUrl + `Athena/LoginWithAthenaAssertion`, obj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SearchPatient(emrId: string, facilityId: number) {
    return this.http
      .get(this.baseUrl + `EmrConnect/SearchPatient/${emrId}?facilityId=${facilityId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RegisterPatient(emrId: string, facilityId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/RegisterPatient/${emrId}?facilityId=${facilityId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SyncPatient(patientId: number) {
    return this.http
      .put(this.baseUrl + `EmrConnect/SyncPatient/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetInsurances(patientId: number) {
    return this.http
      .get(this.baseUrl + `EmrConnect/GetInsurances/${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientAppointments(patientId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/GetPatientAppointments/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateAppointmentNote(appointmentId: number, noteText: string) {
    return this.http
      .post(this.baseUrl + `EmrConnect/CreateAppointmentNote?appointmentId=${appointmentId}&noteText=${noteText}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreatePateintsChartAlert(patientId: number, noteText: string) {
    return this.http
      .post(this.baseUrl + `EmrConnect/CreatePateintsChartAlert?patientId=${patientId}&noteText=${noteText}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetUploadFinantialClaimInfo(dObj: SubmitClaimDto) {
    return this.http
      .get(this.baseUrl + `EmrConnect/GetUploadFinantialClaimInfo?patientId=${dObj.patientId}&monthId=${dObj.monthId}&yearId=${dObj.yearId}&claimType=${dObj.claimType}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientEmrConnectInfo(patientId: number) {
    return this.http
      .get(this.baseUrl + `EmrConnect/GetPatientEmrConnectInfo?patientId=${patientId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  PostVitals(patientId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/PostVitals/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  PostLabResult(patientId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/PostLabResult/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadClinicalDocument(patientId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/UploadClinicalDocument/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadAdminDocumentToPatientChart(patientId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/UploadAdminDocumentToPatientChart/${patientId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadFinancialClaim( patientId: number, dObj: SubmitClaimDto) {
    return this.http
      .post(this.baseUrl + `EmrConnect/UploadFinancialClaim/${patientId}`, dObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadFinancialClaimDocument(patientId: number, dObj: SubmitClaimDto) {
    return this.http
      .post(this.baseUrl + `EmrConnect/UploadFinancialClaimDocument/${patientId}`, dObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SubscribeAppointmentEvents(facilityId: number) {
    return this.http
      .post(this.baseUrl + `EmrConnect/SubscribeAppointmentEvents?facilityId=${facilityId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityPracticeInfo(facilityId: number) {
    return this.http
      .get(this.baseUrl + `EmrConnect/GetFacilityPracticeInfo?facilityId=${facilityId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPracticeInfo(facilityId: number, practiceId: string) {
    return this.http
      .get(this.baseUrl + `EmrConnect/GetPracticeInfo?facilityId=${facilityId}&practiceId=${practiceId}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadFinancialClaims(invoiceId: number, facilityId: number, includeDocument: boolean, includeClaim: boolean, claims: number[]) {
    return this.http
      .post(this.baseUrl + `EmrConnect/UploadFinancialClaims?invoiceId=${invoiceId}&facilityId=${facilityId}&includeClaim=${includeClaim}&includeDocument=${includeDocument}`, claims, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  /*
    status: null,  Not Enrolled (0) , Enrolled (1), Enrolled ElseWhere (2), Declined (3), Unenrolled (4), In eligible (21)
  */
  UpdateCcmEnrollmentStatus(patientId: number, status: number, statusName: string, insuranceId: string) {
    const postObj = {
      "patientId": patientId,
      // "departmentId": 0,
      "insuranceId": insuranceId,
      // "insuranceId": "22639",
      "status": status,
      "statusName": statusName
    }
    return this.http
      .put(this.baseUrl + `EmrConnect/UpdateCcmEnrollmentStatus`, postObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
