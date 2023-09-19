import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  AddEditAnnouncement,
  ChangeAnnouncementStatus,
} from "../model/AppModels/app.model";
import { HttpErrorHandlerService } from "../shared/http-handler/http-error-handler.service";
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
@Injectable({
  providedIn: "root",
})
export class AppAnnouncementService {
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}
  getAllAppAnnouncement() {
    return this.http
      .get(this.baseUrl + `AppData/GetAllAppAnnouncement`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  CreateAppAnnouncement(AddEditAnnouncementDto: AddEditAnnouncement) {
    return this.http
      .post(
        this.baseUrl + `AppData/CreateAppAnnouncement`,
        AddEditAnnouncementDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAppAnnouncement(AddEditAnnouncementDto: AddEditAnnouncement) {
    return this.http
      .put(
        this.baseUrl + `AppData/EditAppAnnouncement`,
        AddEditAnnouncementDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ChangeActiveStatusOfAnnouncement(
    changeAnnouncementStatusDto: ChangeAnnouncementStatus
  ) {
    return this.http
      .put(
        this.baseUrl +
          `AppData/ChangeActiveStateofAnnouncement?id=${changeAnnouncementStatusDto.id}&isActive=${changeAnnouncementStatusDto.isActive}`,
        changeAnnouncementStatusDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteAnnouncement(id){
    return this.http.delete(this.baseUrl + `AppData/DeleteAnnouncement?id=${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
