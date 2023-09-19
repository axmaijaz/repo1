import { data } from "jquery";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { AppUserAuth } from "../model/security/app-user.auth";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";
import { catchError } from "rxjs/operators";
import {
  BhiPatientsScreenParams,
  BhiEncounterDto,
} from "../model/Bhi/bhi.model";
import { FeedbackDto } from "../model/Facility/facility.model";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
const httpOptionsForPlainText = {
  headers: new HttpHeaders({
    "Content-Type": "text" as "json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class FeedbackService {
  baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  constructor(
    private http: HttpClient,
    private router: Router,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  feedbacks(data: FeedbackDto) {
    const formdata = new FormData();
    formdata.append("Facility", data.facility);
    if (data.facilityId) {
      formdata.append("FacilityId", data.facilityId.toString());
    }
    formdata.append("Email", data.email);
    formdata.append("Department", data.department);
    formdata.append("Message", data.message);
    if (data.files) {
      for (var i = 0; i < data.files.length; i++) {
        formdata.append("Files", data.files[i]);
      }
    }
    // formdata.append('Files', data.files);
    return this.http.post(this.baseUrl + `feedbacks`, formdata);
  }
}
