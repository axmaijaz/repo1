import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { catchError } from 'rxjs/operators';
import { EditAMScreeningDto, EditAMCounsellingDto } from 'src/app/model/pcm/pcm-alcohol.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PcmAlcoholService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetAMScreeningById(screeningId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetAMScreeningById/${screeningId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAMCounselingById(screeningId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetCounselingById/${screeningId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAMScreening(data: EditAMScreeningDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/EditAMScreening`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAMCounseling(data: EditAMCounsellingDto) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddEditCounseling`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
