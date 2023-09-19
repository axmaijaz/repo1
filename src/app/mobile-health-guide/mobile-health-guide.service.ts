import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { HealthGuideDto } from "../model/rpm.model";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    //
  }),
};
const httpOptionsForPlainText = {
  headers: new HttpHeaders({
    "Content-Type": "text/plain",
  }),
};
@Injectable({
  providedIn: "root",
})
export class MobileHealthGuideService {
  baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  GetHealthGuideLines() {
    return this.http
      .get(this.baseUrl + "HealthGuideLines", httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddHealthGuideLine(healthGuideDto: HealthGuideDto) {
    return this.http
      .put(this.baseUrl + "HealthGuideLines", healthGuideDto, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteHealthGuideLines(id: number) {
    return this.http
      .delete(this.baseUrl + `HealthGuideLines/${id}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
