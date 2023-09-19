import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class BluButtonService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient,
  ) { }
  getBlueButtonPatientData(code: string, patientId: number) {
    return this.http.post(this.baseUrl + 'BlueButton/GetBlueButtonPatientData?AuthCode=' + code + '&PatientId=' + 1, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
