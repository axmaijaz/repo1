import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { SentTMEncounterDto } from '../model/TeleMedicine/telemedicine.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
const httpOptions1 = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',

  })
};

@Injectable({
  providedIn: 'root'
})
export class TelemedicineService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;

  constructor(
    private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient
  ) { }
  GetTmEncountersByBillingProviderId(bpId: number, PageNumber: number, PageSize: number) {
    return this.http.get(this.baseUrl + `TeleMedicine/GetTmEncountersByBillingProviderId/${bpId}?PageNumber=${PageNumber}&PageSize=${PageSize}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRoomData(encounterId: number) {
    return this.http.get(this.baseUrl + `TeleMedicine/GetRoomData/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  InitTmChatAndNotifyBP(roomId: number, onlineStatus: number) {
    return this.http.post(this.baseUrl + `TeleMedicine/UpdateTmPatientOnlineStatus/${roomId}?onlineStatus=${onlineStatus}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendTMRToNewPatient(data: SentTMEncounterDto) {
    return this.http.post(this.baseUrl + `TeleMedicine/SendTMRToNewPatient`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
startTmEncounter(encounterId: number) {
  return this.http.post(this.baseUrl + `TeleMedicine/StartTmEncounter/${encounterId} `, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));

}
  CheckTmPatientExistEmail(email: string) {
    return this.http.get(this.baseUrl + `TeleMedicine/CheckTmPatientExists?email=`+ email + '&phoneNumber=' , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CheckTmPatientExistsPhone(phone: string) {

    return this.http.get(this.baseUrl + 'TeleMedicine/CheckTmPatientExists?email=&phoneNumber=' + phone , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  sendTMRToExistingPatient(patientId: number, billingProviderId: number) {
    return this.http.get(this.baseUrl + 'TeleMedicine/SendTMRToExistingPatient?patientId=' + patientId +'&billingProviderId=' + billingProviderId, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  endTMEncounter(encounterId: number) {
    return this.http.post(this.baseUrl + `TeleMedicine/EndTmEncounter/${encounterId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  submitTMEncounter(data: any) {
    return this.http.post(this.baseUrl + `TeleMedicine/SubmitTmEncounter2`, data, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  editEncounterNote(encounterId: number, note: string) {
    return this.http.post(this.baseUrl + `TeleMedicine/EditEncounterNote?encounterId=${encounterId}&note=${note}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getEncounterNote(encounterId: number) {
    return this.http.get(this.baseUrl + 'TeleMedicine/GetEncounterNote?encounterId=' + encounterId, httpOptions1).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
