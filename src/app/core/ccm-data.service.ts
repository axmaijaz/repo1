import { data } from 'jquery';
import { HttpClient, HttpHeaders, HttpBackend } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { CcmDailyProgressParamsDto, CcmEncounterForList, CCMMonthlyDataParamsDto, CCMServiceSummaryDto, MinutesCCMServiceParam } from '../model/admin/ccm.model';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { DownloadLogHistoryDto } from '../model/Patient/patient.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class CcmDataService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  private http2: HttpClient;
  constructor(
    private httpErrorService: HttpErrorHandlerService,
    private http: HttpClient,
    private handler: HttpBackend
  ) {
    this.http2 = new HttpClient(handler);
  }

  getDiseases() {
    return this.http.get(this.baseUrl + 'Diseases/GetDiseases');
  }
  ChangeCcmFlag(patientId: number, flagStatus: boolean) {
    const pObj = {
      'patientId': patientId,
      'flagStatus': flagStatus
    };
    return this.http.put(this.baseUrl + `Patients/ChangeCcmFlag`, pObj);
  }
  GetRpmEncountersDurationByPatientId(patientId: number, monthId: number, yearId: number) {
    return this.http.get(
      this.baseUrl +
        `Rpm/GetRpmEncountersDurationByPatientId/${patientId}/${monthId}/${yearId}`
    );
  }
  getPagedDiseases(PageNumber: number, PageSize: number) {
    return this.http.get(
      this.baseUrl +
        'Diseases/GetDiseases?PageNumber=' +
        PageNumber +
        '&PageSize=' +
        PageSize
    );
  }

  changeConsentDate(data: any) {
    return this.http.put(this.baseUrl + 'Patients/EditConsentDate', data);
  }
  getLanguageList() {
    return this.http.get(
      this.baseUrl + 'AppData/GetLanguagesList',
      httpOptions
    );
  }
  changefollowUpDate(data: any) {
    return this.http.put(this.baseUrl + 'Patients/EditFollowUpDate', data);
  }
  getfollowUpDate(id: number) {
    return this.http.get(
      this.baseUrl + `Patients/GetFollowUpDate/${id}`,
      httpOptions
    );
  }

  addCCMEncounter(data: any, ccmMonthlyStatus?: number): Observable<any> {
    data['ccmMonthlyStatus'] = ccmMonthlyStatus;
    return this.http.post(
      this.baseUrl + 'CcmServices/AddCcmEncounter',
      data,
      httpOptions
    );
  }
  EditCcmEncounter(data: any): Observable<any> {
    return this.http.put(
      this.baseUrl + 'CcmServices/EditCcmEncounter',
      data,
      httpOptions
    );
  }
  DeleteCcmEncounter(encounterId: number): Observable<any> {
    return this.http.delete(
      this.baseUrl + `CcmServices/DeleteCcmEncounter/${encounterId}`,
      httpOptions
    );
  }
  getCCMEncounterByPatientId(
    patientId,
    monthId, yearNum
  ): Observable<CcmEncounterForList> {

    return this.http.get<CcmEncounterForList>(
      this.baseUrl +
        'CcmServices/GetCcmEncountersByPatientId/' +
        patientId +
        '?monthId=' +
        monthId +
        '&yearId=' + yearNum
    );
  }

  getStates() {
    return this.http
      .get(this.baseUrl + 'AppData/GetStatesList')
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCcmMSValidityInfo(patientID: number) {
    return this.http
      .get(this.baseUrl + `MonthlyReview/GetCcmMSValidityInfo/${patientID}`)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetMonthlyCcmData(paramObj: CCMMonthlyDataParamsDto) {
    return this.http
      .get(this.baseUrl + `CcmServices/GetMonthlyCcmData?MonthId=${paramObj.monthId}&YearId=${paramObj.yearId}&FacilityId=${paramObj.facilityId}&Status=${paramObj.status}&CareCoordinatorId=${paramObj.careCoordinatorId}&CareFacilitatorId=${paramObj.careFacilitatorId}`)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCityAndStates(code: number) {
    return this.http2.get('https://ziptasticapi.com/' + code);
  }
  getPublicPath(url: string) {
    return this.http
      .get(this.baseUrl + 'S3/GetPublicUrl?path=' + url)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getCCMServiceSummary(data: CCMServiceSummaryDto) {
    return this.http
      .get(
        this.baseUrl +
          'CcmServices/GetCcmServiceSummary?FacilityUserId=' +
          data.careProviderId +
          '&Month=' +
          data.month +
          '&Year=' +
          data.year +
          '&FacilityId=' +
          data.facilityId
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getMinutesSummary(data: MinutesCCMServiceParam) {
    return this.http
      .get(
        this.baseUrl +
          'CcmServices/GetMinutesCompletedSummary?FacilityId=' +
          data.facilityId +
          '&Month=' +
          data.month +
          '&Year=' +
          data.year
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetLogsHistoryByFacilityId(downloadHistoryLog: DownloadLogHistoryDto) {
    return this.http.post(this.baseUrl + `MonthlyReview/GetMonthlyReviewDataByFacilityIdPdf`, downloadHistoryLog,{ responseType: 'blob'});
  }
  GetLogsHistoryByPatientId(patientId: number, monthId: number, yearNum: number, includeCarePlan: boolean, includeRpmLogs: boolean, includeCcmLogs: boolean ) {
    return this.http.get(
      this.baseUrl +
        `Patients/GetPatientDataPdf/` +
        patientId +
        '?monthId=' +
        monthId +
        '&yearId=' +
        yearNum + 
        '&includeCarePlan=' + 
        includeCarePlan + 
        '&includeRpmLogs=' + 
        includeRpmLogs + 
        '&includeCcmLogs=' +
        includeCcmLogs,
      {
        responseType: 'blob'
      }
    );
  }
  GetCarePlanApprovals(facilityId: number) {
    return this.http.get(
      this.baseUrl +
        `Patients/GetCarePlanApprovalsByFacilityId/${facilityId}`
    );
  }
  GetCcmPatientsContactedProgress(data: CcmDailyProgressParamsDto) {
    return this.http.get(
      this.baseUrl +
        `CcmServices/GetCcmPatientsContactedProgress?FacilityId=${data.facilityId}&FacilityUserId=${data.facilityUserId}&StartDate=${data.startDate}&EndDate=${data.endDate}`
    );
  }
  GetCcmPatientsCompletedProgress(data: CcmDailyProgressParamsDto) {
    return this.http.get(
      this.baseUrl +
        `CcmServices/GetCcmPatientsCompletedProgress?FacilityId=${data.facilityId}&FacilityUserId=${data.facilityUserId}&StartDate=${data.startDate}&EndDate=${data.endDate}`
    );
  }
  SetQualityChecked(encounterId, qualityChecked){
    return this.http.put(  this.baseUrl + `CcmServices/SetQualityChecked/${encounterId}?QualityChecked=${qualityChecked}`, httpOptions
    );
  }
}
