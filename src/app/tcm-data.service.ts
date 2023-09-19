import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandlerService } from './shared/http-handler/http-error-handler.service';
import { SecurityService } from './core/security/security.service';
import { catchError } from 'rxjs/operators';
import { PatientDischargeDto, TcmInitialCommDto, NonFaceToFaceDto, FaceToFaceDto, TcmEncounterCloseDto, SignTcmEncounterDto, AddEditTcmInitialCommDto, AddTcmEncounterDto, TcmFilterPatient, AssignTcmProvidersDto } from './model/Tcm/tcm.model';
import { UploadFile } from 'ng-uikit-pro-standard';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TcmDataService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetTcmEncounterForCopy(tcmEncounterId: number) {
    return this.http.get(this.baseUrl + `TcmEncounters/GetTcmEncounterForCopy/${tcmEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getTcmListByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `TcmEncounters/GetTcmEncountersByPatientId?patientId=${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTcmEncounterById(tcmEncounterId: number) {
    return this.http.get(this.baseUrl + `TcmEncounters/GetTcmEncounterById?tcmEncounterId=${tcmEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  createTcm(data: AddTcmEncounterDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/AddTcmEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditPatientDischarge(data: PatientDischargeDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/AddEditPatientDischarge`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditNonFaceToFace(data: NonFaceToFaceDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/AddEditNonFaceToFace`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditFaceToFace(data: FaceToFaceDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/AddEditFaceToFace`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditInitComm(data: AddEditTcmInitialCommDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/AddEditInitComm`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SignTcmEncounter(data: SignTcmEncounterDto) {
    return this.http.post(this.baseUrl + `TcmEncounters/SignTcmEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UploadDoc(tcmId: any, title: string): any {
    const data = new FormData();
    data.append('Title', title);
    data.append('TcmEncounterId', tcmId);
    // data.append('DocumentFile ', mfile);
    return this.http.post(this.baseUrl + `TcmEncounters/AddTcmDocument`, data);
    // , {headers: new HttpHeaders({ 'Content-Type': ' multipart/form-data' })}
    // .pipe(
    //     catchError(this.httpError.handleHttpError)
    // );
  }
  SetTcmEncounterClosedStatus(data: TcmEncounterCloseDto) {
    return this.http.put(this.baseUrl + `TcmEncounters/SetTcmEncounterClosedStatus`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetDischargeDate(TcmEncounterId: number, DischargeDate: string, TentativeDischargeDate: string) {
    const dObj = {
      tcmEncounterId: TcmEncounterId,
      dischargeDate: DischargeDate,
      tentativeDischargeDate: TentativeDischargeDate
    };
    return this.http.post(this.baseUrl + `TcmEncounters/SetDischargeDate`, dObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTcmDocumentsByTcmEncounterId(encounterId: number) {
    return this.http.get(this.baseUrl + `TcmEncounters/GetTcmDocumentsByTcmEncounterId/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatients2(filtersDto: TcmFilterPatient) {
    return this.http.get(this.baseUrl + `TcmEncounters/GetPatients2?PageNumber=${filtersDto.PageNumber}&PageSize=${filtersDto.PageSize}&SearchParam=${filtersDto.SearchParam}&ShowAll=${filtersDto.showAll}&TcmStatus=${filtersDto.tcmStatus}&FacilityUserId=${filtersDto.FacilityUserId}&FacilityId=${filtersDto.FacilityId}&CustomListId=${filtersDto.customListId}&HospitalizationDate=${filtersDto.hospitalizationDate}&FollowupDate=${filtersDto.followupDate}&CcmStatus=${filtersDto.ccmStatus}&BillingProviderId=${filtersDto.BillingProviderId}&SortBy=${filtersDto.sortBy}&SortOrder=${filtersDto.sortOrder}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteTcmDocument(documentId: number) {
    return this.http.delete(this.baseUrl + `TcmEncounters/DeleteTcmDocument/${documentId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPublicPath(url: string) {
    return this.http
      .get(this.baseUrl + 'S3/GetPublicUrl?path=' + url)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  EditTCMDateAssigned(patientId: number, date: string , facilityId: number) {
    const data = {
      patientId: patientId,
      dateAssigned: date,
      facilityId: facilityId
    };
    return this.http
      .put(this.baseUrl + 'Patients/EditTCMDateAssigned', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AssignProviders(dObj: AssignTcmProvidersDto) {
    return this.http
      .post(this.baseUrl + 'TcmEncounters/AssignProviders', dObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
