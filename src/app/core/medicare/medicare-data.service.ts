import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class MedicareDataService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;

  constructor(
    private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient
  ) { }
  getBlueButtonPatientData(code: string, patientId: number) {
    patientId = 1;
    return this.http.post(this.baseUrl + `BlueButton/GetBlueButtonPatientData/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetParticleHealthxml() {
    const data = {
      'address_city': 'Cambridge',
      'address_lines': [
        '123 Main St',
        'Apt 4'
      ],
      'address_state': 'Massachusetts',
      'date_of_birth': '1966-01-18',
      'email': 'john@doe.com',
      'family_name': 'Hermiston',
      'gender': 'FEMALE',
      'given_name': 'Ariel',
      'npi': '9876',
      'postal_code': '02138',
      'purpose_of_use': 'TREATMENT',
      'ssn': '123-45-6789',
      'telephone': '1-234-567-8910'
    };
    return this.http.post(this.baseUrl + `ParticleHealth/GetParticleHealthFile`, data ,  { observe: 'body', responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetParticleHealthZip(patientId: number, ssnNumber: string) {
    if (!ssnNumber) {
      ssnNumber = '';
    }
    return this.http.post(this.baseUrl + `ParticleHealth/GetZipDataByPatientId/${patientId}?ssnNumber=${ssnNumber}`, {} ,  { responseType: 'blob'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEobJsonData(patientId: number, startIndex?: number) {
    // patientId = 1;
    if (!startIndex) {
      startIndex = 0;
    }
    return this.http.post(this.baseUrl + `BlueButton/GetEobJsonData/${patientId}?startIndex=${startIndex}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetEobCode(patientId: number) {
    // patientId = 1;
    return this.http.get(this.baseUrl + `BlueButton/GetCode/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
