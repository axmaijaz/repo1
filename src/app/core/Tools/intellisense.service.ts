import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { AddEditSmartPhraseDto } from 'src/app/model/Tools/intellisense.model';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //
  })
};

@Injectable({
  providedIn: 'root'
})
export class IntellisenseService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}

  GetSystemVariables() {
    return this.http.get(this.baseUrl + `SmartPhrase/GetSystemVariables` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSmartPhrases(userId: number) {
    return this.http.get(this.baseUrl + `SmartPhrase/GetSmartPhrases?userId=${userId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UseSmartPhrase(userId: number, phraseId: number, patientId: number) {
    return this.http.get(this.baseUrl + `SmartPhrase/UseSmartPhrase?userId=${userId}&phraseId=${phraseId}&patientId=${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetModalityReviewText( patientId: number, mCode: string, alertId: number) {
    return this.http.get(this.baseUrl + `SmartPhrase/GetModalityReviewText/${patientId}?modalityCode=${mCode}&alertId=${alertId}` , { responseType: 'text' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditSmartPhrase(obj: AddEditSmartPhraseDto) {
    return this.http.put(this.baseUrl + `SmartPhrase/AddEditSmartPhrase`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteSmartPhrase(pId: number) {
    return this.http.put(this.baseUrl + `SmartPhrase/DeleteSmartPhrase?phraseId=${pId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
