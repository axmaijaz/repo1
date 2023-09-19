import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  EditMonthlyProjection,
  MonthlyProjection,
} from "../model/eodReport.model";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class EndOfDayService {
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;

  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}
  GetCcmEodReportGraph(date) {
    return this.http
      .get(this.baseUrl + `EodReport/GetCcmEodReportGraph?date=${date}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCcmEodReportGraphByFacilityId(facilityId, date) {
    return this.http
      .get(
        this.baseUrl +
          `EodReport/GetCcmEodReportGraphByFacilityId?facilityId=${facilityId}&date=${date}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCcmEodReport(facilityId, date) {
    return this.http
      .get(
        this.baseUrl + `EodReport/GetCcmEodReport?facilityId=${facilityId}&date=${date}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmEodReportGraph(date) {
    return this.http
      .get(this.baseUrl + `EodReport/GetRpmEodReportGraph?date=${date}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRpmEodReportGraphByFacilityId(facilityId, date) {
    return this.http
      .get(
        this.baseUrl +
          `EodReport/GetRpmEodReportGraphByFacilityId?facilityId=${facilityId}&date=${date}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyProjectionByFacilityId(facilityId, month, year) {
    return this.http
      .get(
        this.baseUrl +
          `EodReport/GetMonthlyProjectionByFacilityId?facilityId=${facilityId}&Month=${month}&Year=${year}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditMonthlyProjectionById(monthlyProjection: EditMonthlyProjection) {
    return this.http
      .put(
        this.baseUrl + `EodReport/EditMonthlyProjectionById`,
        monthlyProjection,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyReportForGraph(facilityId){
    return this.http
      .get(
        this.baseUrl + `EodReport/GetMonthlyReportForGraph/${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
