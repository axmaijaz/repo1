import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SecurityService } from "../security/security.service";
import { HttpErrorHandlerService } from "src/app/shared/http-handler/http-error-handler.service";
import { catchError } from 'rxjs/operators';
import { PatientConsents } from "src/app/model/Patient/patient.model";
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
const httpOptions2 = {
  headers: new HttpHeaders({
    // "Content-Type": "application/pdf"
    "Content-Type": "application/csv",


  })
};
const httpOptions1 = {
  headers: new HttpHeaders({
    'responseType': 'html',

  })
};


@Injectable({
  providedIn: "root"
})
export class PatientConsentService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private securityService: SecurityService,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  getPatientConsentsByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + "PatientConsents/" + patientId, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DownloadConsentPdfByConsentId(consentId: number) {
    return this.http.get(this.baseUrl + `PatientConsents/DownloadConsentPdfByConsentId/${consentId}`,{
      responseType: "blob"
    }
  );
  }
  EditPatientConsentById(data: PatientConsents) {
    return this.http.put(this.baseUrl + "PatientConsents/" + data.id, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientConsentById(data: any) {
    return this.http.post(this.baseUrl + "PatientConsents/" + data.consentId, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientConsent(data: any) {
    return this.http.post(this.baseUrl + "PatientConsents", data , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetConsentNoteByConsentNature(data: any) {
    return this.http.get(this.baseUrl + `PatientConsents/GetConsentNoteByConsentNature?consentNature=${data.consentNature}&patientId=${data.patientId}` , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
