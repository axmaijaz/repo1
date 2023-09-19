import { data } from 'jquery';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { catchError } from 'rxjs/operators';
import { EditMeasureDataParams, PcmScreeningSignDto, EditDPCounsellingDto, PreventiveGapScreenParams, CareGapsGraphDto, PcmStatusDto } from 'src/app/model/pcm/pcm.model';
import { EditDepressionScreeningDto } from 'src/app/model/pcm/pcm-depression.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PcmService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetPatientsMeasuresSummary(patientId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPatientsMeasuresSummary/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPreventiveGapSummaryScreenDataPdf(data: any) {
    return this.http.post(this.baseUrl + `PreventiveCare/GetPreventiveGapSummaryScreenDataPdf`, data , { responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }// GetPreventiveGapSummaryScreenData(pgScreenParams: PreventiveGapScreenParams) {
  //   return this.http.post(this.baseUrl + `PreventiveCare/GetPreventiveGapSummaryScreenData?PageNumber=${pgScreenParams.pageNumber}&PageSize=${pgScreenParams.pageSize}&
  //   FacilityId=${pgScreenParams.facilityId}&InsurancePlanIds=${pgScreenParams.insurancePlanIds}&
  //   MeasureIds=${pgScreenParams.measureIds}&Status=${pgScreenParams.status}&LastDoneFrom=${pgScreenParams.lastDoneFrom}&LastDoneTo=${pgScreenParams.lastDoneTo}&
  //   NextDueFrom=${pgScreenParams.nextDueFrom}&NextDueTo=${pgScreenParams.nextDueTo}&ChronicConditionIds=${pgScreenParams.chronicConditionIds}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  // GetPreventiveGapSummaryScreenData(pgScreenParams: PreventiveGapScreenParams) {
  //   return this.http.post(this.baseUrl + `PreventiveCare/GetPreventiveGapSummaryScreenData`, pgScreenParams , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  GetPreventiveGapSummaryScreenData(pgScreenParams: PreventiveGapScreenParams) {
    let chronicIdsStr = '';
    // if (data.chronicDiseasesIds.length > 0) {
    //   chronicIdsStr = data.chronicDiseasesIds.join(',');
    // }
    if (pgScreenParams.tempChronicDiseasesIds && pgScreenParams.tempChronicDiseasesIds.length > 0) {
       chronicIdsStr = pgScreenParams.tempChronicDiseasesIds;

    } else {
    chronicIdsStr = pgScreenParams.diseaseIds.filter(x => x !== '0');
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetPcmPatients?PageNumber=${pgScreenParams.pageNumber}&LastDoneTo=${pgScreenParams.lastDoneTo}&ScheduleFlags=${pgScreenParams.scheduleFlags}
    &GapStatuses=${pgScreenParams.gapStatuses}&LastDoneFrom=${pgScreenParams.lastDoneFrom}
    &PageSize=${pgScreenParams.pageSize}&CcmStatus=${pgScreenParams.ccmStatus}&GapIds=${pgScreenParams.gapIds}&PayerId=${pgScreenParams.payerId}&CustomListId=${pgScreenParams.customListId}
    &SearchParam=${pgScreenParams.searchParam}&ShowAll=${pgScreenParams.showAll}&BillingProviderId=${pgScreenParams.billingProviderId}&CareFacilitatorId=${pgScreenParams.careFacilitatorId}
    &CareProviderId=${pgScreenParams.careProviderId}&FacilityUserId=${pgScreenParams.facilityUserId}&FacilityId=${pgScreenParams.facilityId}&DiseaseIds=${chronicIdsStr}&SortBy=${pgScreenParams.sortBy}
    &SortOrder=${pgScreenParams.sortOrder}&CommunicationConsent=${pgScreenParams.communicationConsent}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdatePcmStatus(pcmStatusDto: PcmStatusDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/UpdatePcmStatus`, pcmStatusDto, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeletePatientsMeasuresSummary (insuranceGapId: number) {
    return this.http.delete(this.baseUrl + `PreventiveCare/DeletePatientsMeasuresSummary/${insuranceGapId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPCMeasureData(patientId: number, code: string) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPCMeasureData?Code=${code}&PatientId=${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditMeasureData(data: EditMeasureDataParams) {
    if (!data.careGapSchedule.scheduleFlag) {
      data.careGapSchedule.scheduleFlag = 0
    }
    return this.http.put(this.baseUrl + `PreventiveCare/AddEditMeasureData`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPublicPath(url: string) {
    return this.http
      .get(this.baseUrl + 'S3/GetPublicUrl?path=' + url)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPatientListExcelFile(data: any) {
    return this.http
      .post(
        this.baseUrl +
          "PriorAuths/GetPriorAuthListExcelFile",data,
          { responseType: 'blob' }
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  addPcDocument(data: any) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddPCDocument`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddAMScreening(patientId: number) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddAMScreening/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddDPScreening(patientId: number) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddDepressionScreening/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCareGapsChartData(data: CareGapsGraphDto) {
    return this.http.post(this.baseUrl + `PreventiveCare/GetCareGapsChartData`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddAMCounseling(patientId: number) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddAMCounseling/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditCounseling(data: any) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddEditCounseling`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddDepressionCounseling(patientId: number) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddDepressionCounseling/${patientId}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // /api/PreventiveCare/AddPCDocumentOnError/{tcmDocId}
  addPCDocumentOnError(data: any) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddPCDocumentOnError/${data.id}/${data.preSignedUrl}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // /api/PreventiveCare/DeletePCDocument/{id}
  deletePCDocument(id: number) {
    return this.http.delete(this.baseUrl + `PreventiveCare/DeletePCDocument/${id}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  getPCMeasuresByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPCMeasuresByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPCMEncountersByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPCMEncountersByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPatientsDueGaps(patientId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPatientsDueGaps/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDPScreeningById(screeningId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetDepressionScreeningById/${screeningId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDPScreening(data: EditDepressionScreeningDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/EditDepressionScreening`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SignAMScreening(data: PcmScreeningSignDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/SignAMScreening`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SignDepressionScreening(data: PcmScreeningSignDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/SignDepressionScreening`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditDepressionCounseling(data: EditDPCounsellingDto) {
    return this.http.post(this.baseUrl + `PreventiveCare/AddEditCounseling`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetDepressionCounselingById(screeningId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetCounselingById/${screeningId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllMeasureInfos() {
    return this.http.get(this.baseUrl + `PreventiveCare/GetAllMeasureInfos` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCoveredPCMeasureDataAverage(facilityId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetCoveredPCMeasureDataAverage/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllPCMeasureDataForGraph(facilityId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetAllPCMeasureDataForGraph2/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAllPCMeasureDataForGraph2(pgScreenParams: PreventiveGapScreenParams) {
    let chronicIdsStr = '';
    // if (data.chronicDiseasesIds.length > 0) {
    //   chronicIdsStr = data.chronicDiseasesIds.join(',');
    // }
    if (pgScreenParams.tempChronicDiseasesIds && pgScreenParams.tempChronicDiseasesIds.length > 0) {
       chronicIdsStr = pgScreenParams.tempChronicDiseasesIds;

    } else {
    chronicIdsStr = pgScreenParams.diseaseIds.filter(x => x !== '0');
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetAllPCMeasureDataForGraph2?PageNumber=${pgScreenParams.pageNumber}&LastDoneTo=${pgScreenParams.lastDoneTo}&ScheduleFlags=${pgScreenParams.scheduleFlags}&GapStatuses=${pgScreenParams.gapStatuses}&LastDoneFrom=${pgScreenParams.lastDoneFrom}&PageSize=${pgScreenParams.pageSize}&CustomListId=${pgScreenParams.customListId}&CcmStatus=${pgScreenParams.ccmStatus}&GapIds=${pgScreenParams.gapIds}&PayerId=${pgScreenParams.payerId}&SearchParam=${pgScreenParams.searchParam}&ShowAll=${pgScreenParams.showAll}&BillingProviderId=${pgScreenParams.billingProviderId}&CareFacilitatorId=${pgScreenParams.careFacilitatorId}
    &CareProviderId=${pgScreenParams.careProviderId}&FacilityUserId=${pgScreenParams.facilityUserId}&FacilityId=${pgScreenParams.facilityId}&DiseaseIds=${chronicIdsStr}&SortBy=${pgScreenParams.sortBy}&SortOrder=${pgScreenParams.sortOrder}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPCMeasureDataForGraph(facilityId: number, measureInfoId: number) {
    return this.http.get(this.baseUrl + `PreventiveCare/GetPCMeasureDataForGraph/${facilityId}/${measureInfoId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

  GetPcmPatients(data: PreventiveGapScreenParams) {
    let chronicIdsStr = '';
    // if (data.chronicDiseasesIds.length > 0) {
    //   chronicIdsStr = data.chronicDiseasesIds.join(',');
    // }
    if (data.tempChronicDiseasesIds && data.tempChronicDiseasesIds.length > 0) {
       chronicIdsStr = data.tempChronicDiseasesIds;

    } else {
    chronicIdsStr = data.diseaseIds.filter(x => x !== '0');
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetPcmPatientsCareGaps?PageNumber=${data.pageNumber}&LastDoneTo=${data.lastDoneTo}&ScheduleFlags=${data.scheduleFlags}&GapStatuses=${data.gapStatuses}&LastDoneFrom=${data.lastDoneFrom}&CcmStatus=${data.ccmStatus}&GapIds=${data.gapIds}&PayerId=${data.payerId}&PageSize=${data.pageSize}&SearchParam=${data.searchParam}&BillingProviderId=${data.billingProviderId}&CareFacilitatorId=${data.careFacilitatorId}&FacilityUserId=${data.facilityUserId}&DiseaseIds=${chronicIdsStr}&CareProviderId=${data.careProviderId}&FacilityId=${data.facilityId}&SortBy=${data.sortBy}&SortOrder=${data.sortOrder}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPcmPatientsCareGapsExcel(data: PreventiveGapScreenParams) {
    let chronicIdsStr = '';
    // if (data.chronicDiseasesIds.length > 0) {
    //   chronicIdsStr = data.chronicDiseasesIds.join(',');
    // }
    if (data.tempChronicDiseasesIds && data.tempChronicDiseasesIds.length > 0) {
       chronicIdsStr = data.tempChronicDiseasesIds;

    } else {
    chronicIdsStr = data.diseaseIds.filter(x => x !== '0');
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetPcmPatientsCareGapsExcel?PageNumber=${data.pageNumber}&LastDoneTo=${data.lastDoneTo}&includeGapDetails=${data.includeGapDetails}&ScheduleFlags=${data.scheduleFlags}&GapStatuses=${data.gapStatuses}&LastDoneFrom=${data.lastDoneFrom}&CcmStatus=${data.ccmStatus}&GapIds=${data.gapIds}&PayerId=${data.payerId}&PageSize=${data.pageSize}
    &SearchParam=${data.searchParam}&BillingProviderId=${data.billingProviderId}&CareFacilitatorId=${data.careFacilitatorId}&FacilityUserId=${data.facilityUserId}&DiseaseIds=${chronicIdsStr}&CareProviderId=${data.careProviderId}&FacilityId=${data.facilityId}&SortBy=${data.sortBy}&SortOrder=${data.sortOrder}`,
    { responseType: 'blob' }).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateDueGapeNote(data: any) {
    return this.http.post(this.baseUrl + `PreventiveCare/UpdateDueGapeNote`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetCareGapQualityChecked(id: number) {
    return this.http.put(this.baseUrl + `PreventiveCare/SetCareGapQualityChecked/${id}?gapId=${id}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPCMeasureDataList(pId: number, gapCodes: any) {
    let data = {
      patientId: pId,
      codes: gapCodes,

    }
    return this.http.post(this.baseUrl + `PreventiveCare/GetPCMeasureDataList`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetFacilityGaps(facilityId: number) {
    if (!facilityId) {
      facilityId = 0;
    }
    return this.http.get(this.baseUrl + `PreventiveCare/GetFacilityGaps/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
