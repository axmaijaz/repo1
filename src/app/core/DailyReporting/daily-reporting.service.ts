import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { Observable } from 'rxjs';
import { DailyProgreeForDashboardDto, DailyReportingDto } from 'src/app/model/daily-Report/daily_report.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};

@Injectable({
  providedIn: 'root'
})
export class DailyReportingService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}
  AddEditDailyReport(data: DailyReportingDto) {
    return this.http
      .post(this.baseUrl + 'DailyReports/AddEditDailyReport', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  getDailyReportForView(data: DailyReportingDto) {
    return this.http
      .get(this.baseUrl + 'DailyReports/GetDailyReportForView', httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getDailyReportSummary(data: any) {
    return this.http
      .get(
        this.baseUrl +
          'DailyReports/GetDailyReportSummary/' +
          data.facilityId +
          '/' +
          data.careProviderId +
          '/' +
          data.year +
          '/' +
          data.month,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  GetAllCareProviderReportsByCareProviderId(CareProviderId: number) {
    return this.http
      .get(
        this.baseUrl +
          'DailyReports/GetAllDailyReportsByCareProviderId/' +
          CareProviderId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDailyReportByReportId(reportId: number) {
    return this.http
      .get(this.baseUrl + 'DailyReports/GetDailyReportById/' + reportId)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyProgressForProgressBar(data: DailyProgreeForDashboardDto) {
    return this.http
      .get(this.baseUrl + `DailyReports/GetMonthlyProgressForProgressBar?FacilityId=${data.facilityId}&FacilityUserId=${data.facilityUserId}&Role=${data.role}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
