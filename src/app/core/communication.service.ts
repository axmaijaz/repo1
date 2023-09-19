import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { EmitEvent, EventBusService, EventTypes } from './event-bus.service';
import { SecurityService } from './security/security.service';
import { AddCommunicationDto, ChangeCommunicationFlagsDto, GetCommunicationGroupParam, MarkCommunicationViewedDto, MarkPatientGroupFlagsDto, PatientCommunicationHistoryDto } from '../model/PatientEngagement/communication.model';
import { PemMapNumberDto } from '../model/PatientEngagement/pem.model';
import { PatientDto } from '../model/Patient/patient.model';
import { AddCcmEncounterDto } from '../model/admin/ccm.model';
import { RPMEncounterDto } from '../model/rpm.model';
import { RPMServiceType } from '../Enums/rpm.enum';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  callInterval: NodeJS.Timeout;
  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private httpErrorService: HttpErrorHandlerService,
  )  { }

  GetPatientGroups(facilityId: number, pData: GetCommunicationGroupParam) {
    let qStr = ``
    if (pData.PageNumber) {
      qStr += `PageNumber=${pData.PageNumber}&`
    }
    if (pData.PageSize) {
      qStr += `PageSize=${pData.PageSize}&`
    }
    if (pData.UnRead) {
      qStr += `Unread=${pData.UnRead}&`
    }
    if (pData.Critical) {
      qStr += `Critical=${pData.Critical}&`
    }
    if (pData.Following) {
      qStr += `Following=${pData.Following}&`
    }
    // if (facilityId ) {
    //   qStr += `FacilityId=${facilityId}&`
    // }
    if (pData.SortBy) {
      qStr += `SortBy=${pData.SortBy.toLowerCase()}&SortOrder=${pData.SortOrder || 0}`
    }
    return this.http.get(this.baseUrl + `PatientCommunication/GetPatientGroups/${facilityId}?${qStr}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCommunicationSummaryData(facilityId: number) {
    return this.http.get(this.baseUrl + `PatientCommunication/GetCommunicationSummaryData/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAnonymousMessages(facilityId: number) {
    return this.http.get(this.baseUrl + `PatientCommunication/GetAnonymousMessages/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetCommunicationHistory(patientId: number, month = 0, year = 0) {
    let qStr = ``
    if (true) {
      qStr += `PageNumber=${1}&`
    }
    if (true) {
      qStr += `PageSize=${100000}&`
    }
    if (month) {
      qStr += `month=${month}&`
    }
    if (true) {
      qStr += `year=${year}&`
    }
    return this.http.get(this.baseUrl + `PatientCommunication/GetCommunicationHistory/${patientId}?${qStr}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddPatientCommunication(pData: AddCommunicationDto) {
    return this.http.post(this.baseUrl + `PatientCommunication`, pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MarkCommunicationViewed(pData: MarkCommunicationViewedDto) {
    return this.http.post(this.baseUrl + `PatientCommunication/MarkCommunicationViewed`, pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MarkPatientGroupFlags(pData: MarkPatientGroupFlagsDto) {
    return this.http.post(this.baseUrl + `PatientCommunication/MarkPatientGroupFlags`, pData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MapPatientPhoneNumber(obj: PemMapNumberDto) {
    return this.http.post(this.baseUrl + `PatientCommunication/MapUserPhoneNumberByPatientId`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ChangePatientsCommunicationFlags(obj: ChangeCommunicationFlagsDto) {
    return this.http.put(this.baseUrl + `PatientCommunication/ChangePatientsCommunicationFlags`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  OpenCCMEncounterModel(patient: PatientDto, note = '', commHistory: PatientCommunicationHistoryDto[] = []) {
    const encounterObj = new AddCcmEncounterDto()
    encounterObj.ccmServiceTypeId = 27;
    const messageIds = commHistory.filter(x => x.selected && x.serviceType == null).map(x => x.id);
    if(!messageIds.length){
      this.toaster.warning('Please select the message to do the encounter.');
      return;
    }
    encounterObj['duration'] = messageIds.length || 1 as any;
    encounterObj.patientCommunicationIds = messageIds;
    encounterObj.note = note
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.OpenCCMQuickEncounter;
    emitObj.value = {
      type: EventTypes.OpenCCMQuickEncounter.toString(),
      data: {
        patient: patient,
        encounterObj
      },
      config: {
        hideTimer: true
      }
    };
    this.eventBus.emit(emitObj);
  }
  OpenRPMEncounterModel(patient: PatientDto, note = '', commHistory: PatientCommunicationHistoryDto[] = []) {
    const encounterObj = new RPMEncounterDto()
    encounterObj.rpmServiceType = RPMServiceType.Text;
    const messageIds = commHistory.filter(x => x.selected && x.serviceType == null).map(x => x.id);
    if(!messageIds.length){
      this.toaster.warning('Please select the message to do the encounter.');
      return;
    }
    encounterObj.duration = messageIds.length || 1 as any;
    encounterObj.patientCommunicationIds = messageIds;
    encounterObj.note = note;
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.OpenRPMQuickEncounter;
    emitObj.value = {
      type: EventTypes.OpenRPMQuickEncounter.toString(),
      data: {
        patient: patient,
        encounterObj,
        config: {
          hideTimer: true
        }
      },

    };
    this.eventBus.emit(emitObj);
  }
}
