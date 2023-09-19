import { find } from 'cfb/types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LandingPageParamsDto } from '../model/home.model';
import { AppUserAuth } from '../model/security/app-user.auth';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //
  })
};
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient, private router: Router, private httpErrorService: HttpErrorHandlerService) {}
  GetPatientsForDashboard(data: LandingPageParamsDto) {
    let nArr = '';
    if (!data) {
      data = new LandingPageParamsDto();
    }
    const isAll = data['patientStatus']?.find(x => x === 0);
    if (isAll || isAll === 0) {
      nArr = '';
    } else {
      nArr = data.patientStatus?.join();
    }
    return this.http
      .get(
        this.baseUrl +
          "Patients/GetPatientsForDashboard?PageNumber=" +
          data.pageNumber +
          "&PageSize=" +
          data.pageSize +
          "&FacilityId=" +
          data.facilityId +
          "&SortBy=" +
          data.sortBy +
          "&SortOrder=" +
          data.sortOrder +
          "&SearchParam=" +
          data.searchParam +
          "&PayerIds=" +
          data.payerIds +
          "&FilterBy=" +
          data.filterBy +
          "&PatientStatus=" +
          nArr,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
