import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { SecurityService } from '../security/security.service';
import { catchError } from 'rxjs/operators';
import { AWPhysiciantabEncounterDto, AddEditAWScreeningDto, SignAwEncounterDto, SendAWToPatientDto, UpdatePWReportDto, UpdateAWReportDto, FilterAwPatientsDto, HRACallStatus } from 'src/app/model/AnnualWellness/aw.model';
import { SuperBillDto } from 'src/app/model/AnnualWellness/superbill.model';
import { AddendumNoteDto, CloseEncounterDto } from 'src/app/model/pcm/pcm.model';
import { HumanaCareGapParamsDto, HumanaResDto } from 'src/app/model/AnnualWellness/humana.model';
import { FacilityFormsDto } from 'src/app/model/Facility/facility.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',

  })
};
const httpOptions12 = {
  headers: new HttpHeaders({
    'Content-Type': 'text/plain',

  })
};


@Injectable({
  providedIn: 'root'
})
export class AwService {
  private baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService
  ) {}
  GetAWPatients(fObj: FilterAwPatientsDto) {
    let qString = ``;
    qString += `FacilityId=${fObj.FacilityId || ''}&`
    qString += `ShowAll=${fObj.ShowAll || false}&`
    qString += `SearchParam=${fObj.SearchParam || ''}&`
    qString += `ServiceYear=${fObj.ServiceYear || 0}&`
    if (fObj.CustomListId) {
      qString += `CustomListId=${fObj.CustomListId || ''}&`
    }
    if (fObj.SortOrder) {
      qString += `SortOrder=${fObj.SortOrder || 0}&`
    }
    if (fObj.SortBy) {
      qString += `SortBy=${fObj.SortBy || 0}&`
    }
    if (fObj.FilterText) {
      qString += `FilterText=${fObj.FilterText || 0}&`
    }
    qString += `pagingParams.PageNumber=${fObj.PageNumber}&`
    qString += `pagingParams.PageSize=${fObj.PageSize}&`
    return this.http.get(this.baseUrl + `AnnualWellness/GetPatients?${qString}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWDashboardData(facilityId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWDashboardData?FacilityId=${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateAWVisitScheduleDate(encounterId: number, visitDate: string) {
    var dObj = {
      "encounterId": encounterId,
      "awVisitScheduleDate": visitDate
    }
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateAWVisitScheduleDate`, dObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateHRACallStatus(encounterId: number, status: HRACallStatus  ,hraCallHistory: string) {
    var dObj = {
      "encounterId": encounterId,
      "hraCallStatus": status,
      "hraCallHistory": hraCallHistory
    }
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateHRACallStatus`, dObj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWEncountersByPatientId(patientId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWEncountersByPatientId/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSuperBill(patientId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetSuperBill/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAWEncounterNotes(data: AWPhysiciantabEncounterDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/EditAWPhysicianTab`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditSuperBill(data: SuperBillDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/EditSuperBill`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ClosePcmEncounter(data: CloseEncounterDto) {
    return this.http.put(this.baseUrl + `PreventiveCare/ClosePcmEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SignAWEncounter(data: SignAwEncounterDto) {
    return this.http.post(this.baseUrl + `AnnualWellness/SignAWEncounter`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateEncounterDate(awEncounterId:number , updatedDate: string) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateEncounterDate/${awEncounterId}/${updatedDate}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendToPatient(data: SendAWToPatientDto) {
    return this.http.post(this.baseUrl + `AnnualWellness/SendToPatient`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditAWScreening(data: AddEditAWScreeningDto) {
    return this.http.post(this.baseUrl + `AnnualWellness/AddEditAWScreening`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWEncounterPhysicianTabById(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWEncounterPhysicianTabById/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWEncounterPatientTabById(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWEncounterPatientTabById/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWEncounterProviderTabById(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWEncounterProviderTabById/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetStaffCareCoordinator(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetStaffCareCoordinator/${encounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }

  RemoveAWForm(awEncounterId: number, formType: number) {
    return this.http.delete(this.baseUrl + `AnnualWellness/RemoveAWForm/${awEncounterId}/${formType}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPendingEncounterListExcelFile(data: any) {
    return this.http.post(this.baseUrl + 'AnnualWellness/GetPendingEncounterListExcelFile', data, { responseType: 'blob'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSuperBillPdf(awId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetSuperBillPdf/${awId}` , { responseType: 'blob'
    });
  }
  AddAWEncounter(patientId: number) {
    return this.http.post(this.baseUrl + `AnnualWellness/AddAWEncounter`, {patientId} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateStaffCareCoordinator(awEncounterId: number, coordinatorId: number) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateStaffCareCoordinator/${awEncounterId}/${coordinatorId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdatePWReport(data: UpdatePWReportDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdatePWReport`, data , { responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPWReport(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetPWReport/${encounterId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RefreshPWReport(encounterId: number) {
    return this.http.put(this.baseUrl + `AnnualWellness/RefreshPWReport/${encounterId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPreviousPWReport(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetPreviousPWReport/${encounterId}`, { responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateAWReport(data: UpdateAWReportDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateAWReport`, data , { responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAWReport(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAWReport/${encounterId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RefreshAWReport(encounterId: number) {
    return this.http.put(this.baseUrl + `AnnualWellness/RefreshAWReport/${encounterId}`, httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPreviousAWReport(encounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetPreviousAWReport/${encounterId}`, { responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditAWQuestion(data: {questionId: number, response: string, shortDesc: string, awEncounterId: number}) {
    return this.http.put(this.baseUrl + `AnnualWellness/EditAWQuestion`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddCognitiveAssessmentDocumentForAWEncounter(encounterID: number, fileName: string) {
    return this.http.post(this.baseUrl + `AnnualWellness/AddCognitiveAssessmentDocumentForAWEncounter/${encounterID}/${fileName}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddCognitiveAssessmentDocumentError(encounterID: number) {
    return this.http.put(this.baseUrl + `AnnualWellness/AddCognitiveAssessmentDocumentError/${encounterID}`, {} , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditStaffNote(data: any) {
    return this.http.put(this.baseUrl + `AnnualWellness/EditStaffNote`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetTCMEncounterDetailsForAW(patientId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetTCMEncounterDetailsForAW/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetHumanaForm(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetHumanaForm/${awEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetIsSyncFromAnnualWellness(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetIsSyncFromAnnualWellness/${awEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RefreshGapsData(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetGapsData/${awEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdateSyncFromAnnualWellness(awEncounterId: number, isSyncDisabled: boolean) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateSyncFromAnnualWellness/${awEncounterId}/${isSyncDisabled}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAwEncounterForCopy(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAwEncounterForCopy/${awEncounterId}` , httpOptions12).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddAnnualWellnessAddendum(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/AddAnnualWellnessAddendum?encounterId=${awEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetSuperbillHoverData(awEncounterId: number) {
    // GetSuperbillHoverData/{awEncounterId}
    return this.http.get(this.baseUrl + `AnnualWellness/GetSuperbillHoverData/${awEncounterId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddEditAddendumNote(data: AddendumNoteDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/AddEditAddendumNote`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditHumanaForm(data: HumanaResDto, otherRace: string) {
    if (otherRace) {
      data.humanaDto.patientInfo.raceOrEthnicity = otherRace;
    }
    return this.http.put(this.baseUrl + `AnnualWellness/EditHumanaForm`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RefreshHumanaCareGpasData(data: HumanaCareGapParamsDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/RefreshHumanaCareGpasData`, data , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAnnualWellnessPdf(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetAnnualWellnessPdf?encounterId=${awEncounterId}` ,
      {
        responseType: "blob"
      }
    );
  }
  GetMergedPdf(data: any) {
    return this.http.post(this.baseUrl + `AnnualWellness/GetMergedPdf` , data,
      {
        responseType: "blob"
      }
    );
  }
  GetHumanaPdf(awEncounterId: number) {
    return this.http.get(this.baseUrl + `AnnualWellness/GetHumanaPdf/${awEncounterId}` ,
      {
        responseType: "blob"
      }
    );
  }
  UpdateAWServiceStatus(updateAwServiceStatusDto) {
    return this.http.put(this.baseUrl + `AnnualWellness/UpdateAWServiceStatus`,updateAwServiceStatusDto , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
}
