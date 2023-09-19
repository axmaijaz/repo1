import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SecurityService } from '../security/security.service';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { PatientTaskDto } from 'src/app/model/Patient/patient-Task.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class PatientTackService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  addEditPatientTask(data: PatientTaskDto) {
    return this.http
      .post(this.baseUrl + "PatientTask/AddEditPatientTask",  data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientTaskById(id: number) {
    return this.http
      .get(this.baseUrl + "PatientTask/GetPatientTaskById/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientTaskByPatientId(id: number) {
    return this.http
      .get(this.baseUrl + "PatientTask/GetPatientTaskByPatientId/" + id, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientTasksList(showall: boolean,facilityId: number) {
    return this.http.get(this.baseUrl + `PatientTask/GetPatientTasksList?facilityId=${facilityId}&showAll=${showall}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllPatientTasks() {
    return this.http
      .get(this.baseUrl + "PatientTask/GetAllPatientTasks", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
