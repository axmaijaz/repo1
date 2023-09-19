import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { InsightsSettingDto } from '../model/Insights/insight.model';
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
export class InsightsService {

  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetQuickViewConfigByFacilityId(facilityId: number) {
    return this.http.get(this.baseUrl + `QuickViewConfig/GetQuickViewConfigByFacilityId/${facilityId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddorEditQuickViewConfigByFacilityId(obj: InsightsSettingDto) {
    return this.http.put(this.baseUrl + `QuickViewConfig/AddorEditQuickViewConfigByFacilityId`, obj, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
