import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { environment } from 'src/environments/environment';
import { EventBusService } from '../core/event-bus.service';
import { SecurityService } from '../core/security/security.service';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { catchError } from 'rxjs/operators';
import { AddEditCommunicationTemplate, FilterTagDataParam, PostBulkCommDto } from '../model/PatientEngagement/bulk-communication.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BulkCommunicationService {

  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  callInterval: NodeJS.Timeout;
  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private httpErrorService: HttpErrorHandlerService,
  )  { }

  GetTagsData(fObj: FilterTagDataParam) {
    return this.http.get(this.baseUrl + `MassCommunications/GetTagsData/${fObj.facilityId || 0}?communicationMethod=${fObj.communicationMethod}&serviceModule=${fObj.serviceModule}&communicationState=${fObj.communicationState}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  PostBulkMessage(pObj: PostBulkCommDto) {
    return this.http.post(this.baseUrl + `MassCommunications/PostBulkMessage`, pObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllTags(facilityId: number) {
    return this.http.get(this.baseUrl + `PatientTags/GetAllTags/${facilityId || 0}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTagById(tagId: number) {
    return this.http.get(this.baseUrl + `PatientTags/GetTagById/${tagId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientTags(facilityId: number, name: string) {
    return this.http.post(this.baseUrl + `PatientTags`, {name,facilityId: facilityId || null} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllTemplates(facilityId: number) {
    return this.http.get(this.baseUrl + `PatientCommTemplates/GetAllTemplates/${facilityId || 0}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTemplateById(tempId: number) {
    return this.http.get(this.baseUrl + `PatientCommTemplates/${tempId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteTemplate(tempId: number) {
    return this.http.delete(this.baseUrl + `PatientCommTemplates/${tempId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditTemplate(dObj: AddEditCommunicationTemplate) {
    return this.http.put(this.baseUrl + `PatientCommTemplates`, dObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UseTemplate(templateId: number, patientId: number) {
    return this.http.get(this.baseUrl + `PatientCommTemplates/UseTemplate?templateId=${templateId}&patientId=${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPatientReviewNote( patientId: number, reviewNote: string) {
    return this.http.put(this.baseUrl + `Patients/EditPatientReviewNote/${patientId}?reviewNote=${reviewNote}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientReviewNote( patientId: number) {
    return this.http.get(this.baseUrl + `Patients/GetPatientReviewNote/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
