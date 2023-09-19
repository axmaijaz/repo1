import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AddInsurancePlanDto } from 'src/app/model/pcm/payers.model';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { GAD7ScreeningToolDto } from 'src/app/model/ScreeningTools/gad7.model';
import { DAST20ScreeningToolDto } from 'src/app/model/ScreeningTools/dast20.model';
import { WSASScreeningToolDto } from 'src/app/model/ScreeningTools/wasa.model';
import { PHQScreeningToolDto } from 'src/app/model/ScreeningTools/phq.modal';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ValidatedScreeningToolService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetGAD7ByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `Gad7ScreeningTools/GetGAD7ByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteGad7ScreeningTools(ItemId: number) {
    return this.http.delete(this.baseUrl + `Gad7ScreeningTools/${ItemId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditGad7ScreeningTools(ItemId: number, data: GAD7ScreeningToolDto) {
    return this.http.put(this.baseUrl + `Gad7ScreeningTools/${ItemId}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddGad7ScreeningTools(data: GAD7ScreeningToolDto) {
    return this.http.post(this.baseUrl + `Gad7ScreeningTools`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDast20ByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `Dast20ScreeningTools/GetDast20ByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteDast20ScreeningTools(ItemId: number) {
    return this.http.delete(this.baseUrl + `Dast20ScreeningTools/${ItemId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDast20ScreeningTools(ItemId: number, data: DAST20ScreeningToolDto) {
    return this.http.put(this.baseUrl + `Dast20ScreeningTools/${ItemId}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddDast20ScreeningTools(data: DAST20ScreeningToolDto) {
    return this.http.post(this.baseUrl + `Dast20ScreeningTools`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetWsasByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `WsasScreeningTools/GetWSASByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteWsasScreeningTools(ItemId: number) {
    return this.http.delete(this.baseUrl + `WsasScreeningTools/${ItemId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditWsasScreeningTools(ItemId: number, data: WSASScreeningToolDto) {
    return this.http.put(this.baseUrl + `WsasScreeningTools/${ItemId}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddWsasScreeningTools(data: WSASScreeningToolDto) {
    return this.http.post(this.baseUrl + `WsasScreeningTools`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPhqByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `PhqScreeningTools/GetPHQByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePhqScreeningTools(ItemId: number) {
    return this.http.delete(this.baseUrl + `PhqScreeningTools/${ItemId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPhqScreeningTools(ItemId: number, data: PHQScreeningToolDto) {
    return this.http.put(this.baseUrl + `PhqScreeningTools/${ItemId}`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPhqScreeningTools(data: PHQScreeningToolDto) {
    return this.http.post(this.baseUrl + `PhqScreeningTools`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetBhiEncounterALL(patientId: number) {
    return this.http.get(this.baseUrl + `Bhi/GetBhiEncounterALL/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
