import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RpmComplainceEditDto } from '../model/rpmComplaince.model';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class RpmComplainceService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetPatientsMuteList(FacilityId: number, showAll= false, patientId?: number, ) {
    let pUrl = '';
    if (patientId) {
      pUrl = `&PatientId=${patientId || ''}`;

    }

    return this.http.get(this.baseUrl + `Rpm/GetPatientsMuteList?FacilityId=${FacilityId}${pUrl}&showAll=${showAll}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientToMuteList(editMute: RpmComplainceEditDto) {

    return this.http.put(this.baseUrl + `Rpm/AddPatientToMuteList`, editMute, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RemovePatientFromMuteList(patientId: number) {

    return this.http.put(this.baseUrl + `Rpm/RemovePatientFromMuteList/${patientId}`, {}, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
