import { Injectable } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private subject = new Subject<any>();

  constructor() {}

  on(event: EventTypes): Observable<any> {
    return this.subject
      .pipe(
        filter((e: EmitEvent) => {
          return e.name === event;
        }),
        map((e: EmitEvent) => {
          return e.value;
        })
      );
  }

  emit(event: EmitEvent) {
    this.subject.next(event);
  }
}

export class EmitEvent {
  name: any;
  value: any;
}

export enum EventTypes {
  OpenClinicalSummary = 1,
  patientAlertModal = 2,
  OpenModalityConfig = 3,
  Open2cChatModal = 4,
  OpenPatientNote = 5,
  RemoveChatNotif = 6,
  GapsDataChanged = 7,
  AwSyncingCheckbox = 8,
  CustomListModal = 9,
  RefreshCustomList = 10,
  ScreenLocked = 11,
  OpenGapDetail = 12,
  LoginLogout = 13, // 1 for login 2 for logout
  ToggleRCMainView = 14, // 1 for login 2 for logout
  OpenSharedLoginWarningModal = 15,
  RequestForLoginAttemptElementRef = 16,
  refreshQualityMeasureTab = 17,
  openComplaintsModal = 18,
  stopRecordingEmit = 19,
  TriggerGlobalIntellisenseWIdget = 20,
  PhraseSelectedEvent = 21,
  SpeechTextEvent = 22,
  TriggerGlobalIframe = 23,
  OnGoingDowloadsProgress = 24,
  openAddComplaintModal = 25,
  Close2cChatModal = 26,
  DeviceScanResult = 27,
  RCSMSEvent = 28,
  OnUploadClaimDocProgress = 29,
  GlobalIframeClosed = 30,
  NewCommunicationMessage = 31,
  OpenCommunicationModal = 32,
  OpenCCMQuickEncounter = 33,
  OpenRPMQuickEncounter = 34,
  CommunicationEncounterEdit = 35
}
