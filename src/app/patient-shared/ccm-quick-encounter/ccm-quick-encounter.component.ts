import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { CcmMonthlyStatus } from 'src/app/Enums/filterPatient.enum';
import { AddCcmEncounterDto, CcmEncounterTimeEnum, CCMMonthlyDataParamsDto, CCMMonthlyDataResponseDto } from './../../model/admin/ccm.model';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { EmitEvent, EventTypes } from 'src/app/core/event-bus.service';
import { EventBusService } from './../../core/event-bus.service';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';
import { TwoCModulesEnum } from 'src/app/model/productivity.model';
import { ClonerService } from 'src/app/core/cloner.service';

@Component({
  selector: 'app-ccm-quick-encounter',
  templateUrl: './ccm-quick-encounter.component.html',
  styleUrls: ['./ccm-quick-encounter.component.scss']
})
export class CcmQuickEncounterComponent implements OnInit {
  @Output() encounterSaved = new EventEmitter();
  @ViewChild("addEncounterModal") addEncounterModal: ModalDirective;
  @ViewChild("myFIeldRefCCM12") myFIeldRefCCM12: TwoCTextAreaComponent;

  addCCMEncounterDto = {
    id: 0,
    startTime: "",
    endTime: "",
    ccmServiceTypeId: 0,
    careProviderId: 0,
    patientId: 0,
    appAdminId: 0,
    duration: 0,
    encounterDate: "",
    note: "",
    patientCommunicationIds: []
  };
  hideTimerForChatEncounter = false;
  showAlertFEncounter: boolean;
  isLoading: boolean;
  PatientEncounterMonthlyStatusAcknowledge = false;
  PatientEncounterMonthlyStatus = CcmMonthlyStatus["Not Started"];
  PatientEncounterMonthlyStatusTExt =
    CcmMonthlyStatus[CcmMonthlyStatus["Not Started"]];
  getCCMMonthlyDataParamObj = new CCMMonthlyDataParamsDto();
  stopWatchValue: number;
  stopWatchInterval: NodeJS.Timeout;
  CCMMonthlyDataResponseDtoObj = new CCMMonthlyDataResponseDto();
  CcmMonthlyStatusList = this.filterDataService.getEnumAsList(CcmMonthlyStatus);
  CcmEncounterTimeEnumList =
    this.filterDataService.getEnumAsList(CcmEncounterTimeEnum);
  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  myduration: any;
  patient: PatientDto;

  constructor(
    private ccmService: CcmDataService,
    private toaster: ToastService,
    private eventBus: EventBusService,
    private cloner: ClonerService,
    private filterDataService: DataFilterService,
    public securityService: SecurityService,) { }

  ngOnInit(): void {
    this.SubscribeOpenModalRequest();
  }
  SubscribeOpenModalRequest() {
    this.eventBus.on(EventTypes.OpenCCMQuickEncounter).subscribe((res: { type: string, data: { patient: PatientDto, encounterObj: AddCcmEncounterDto }, config:{hideTimer: boolean}}) => {
      if (res.type == EventTypes.OpenCCMQuickEncounter.toString()) {
        this.OpenAddEncounterModal(res.data.patient, res.data.encounterObj, res.config.hideTimer)
      }
    });
  }

  OpenAddEncounterModal(patient: PatientDto, encounterDetail?: AddCcmEncounterDto, hideTimer?: boolean) {
    // selectModalList = 'ServiceTypes';
    this.patient = patient
    if(hideTimer){
      if(patient.ccmMonthlyStatus != CcmMonthlyStatus.Completed){
        patient.ccmMonthlyStatus = CcmMonthlyStatus['Partially Completed']
      }
    }
    this.PatientEncounterMonthlyStatus = patient.ccmMonthlyStatus || CcmMonthlyStatus["Not Started"];
    this.PatientEncounterMonthlyStatusTExt = CcmMonthlyStatus[patient.ccmMonthlyStatus];
    this.PatientEncounterMonthlyStatusAcknowledge = false;
    this.resetCcmEncounterlist();
    this.AssignValueCcmService();
    // this.addEncounterModalFn();
    this.calculateEndtime();
    if (encounterDetail) {
      this.addCCMEncounterDto.ccmServiceTypeId = encounterDetail.ccmServiceTypeId;
      this.addCCMEncounterDto.duration = encounterDetail['duration'] || 0;
      this.addCCMEncounterDto.note = encounterDetail.note;
      this.addCCMEncounterDto.patientCommunicationIds = encounterDetail.patientCommunicationIds || [];
      this.durationChanged(this.addCCMEncounterDto.duration)
      this.FillNoteText(encounterDetail.note)
    }
    if(hideTimer){
      this.hideTimerForChatEncounter = true;
    }
    this.addEncounterModal.show();
    if(hideTimer){
      this.PatientEncounterMonthlyStatusAcknowledge=true;
    }
    // this.addCCMEncounterDto.ccmServiceTypeId = 0;
    // addEncounterModalFn();
  }
  FillNoteText(text: string) {
    if (this.myFIeldRefCCM12?.FillValue) {
      this.myFIeldRefCCM12.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefCCM12?.FillValue) {
          this.myFIeldRefCCM12.FillValue(text);
        }
      }, 1000);
    }
  }
  AssignValueCcmService() {
    if (this.addCCMEncounterDto.ccmServiceTypeId === 8) {
      this.addCCMEncounterDto.duration = 5;
      this.addCCMEncounterDto.note = "Discussed with other providers office.";
    } else if (this.addCCMEncounterDto.ccmServiceTypeId === 12) {
      this.addCCMEncounterDto.duration = 5;
      this.addCCMEncounterDto.note = "Arranged medical refill.";
    } else if (this.addCCMEncounterDto.ccmServiceTypeId === 19) {
      this.addCCMEncounterDto.note = "Reviewed and uploaded lab results.";
      this.addCCMEncounterDto.duration = 7;
    } else if (this.addCCMEncounterDto.ccmServiceTypeId === 35) {
      this.addCCMEncounterDto.note = "Got preapproval for the patient.";
      this.addCCMEncounterDto.duration = 5;
    } else if (this.addCCMEncounterDto.ccmServiceTypeId === 40) {
      this.addCCMEncounterDto.duration = 5;
      this.addCCMEncounterDto.note = "Arranged referral for the patient.";
    } else {
      this.addCCMEncounterDto.duration = null;
      this.addCCMEncounterDto.note = "";
    }
  }
  calculateEndtime() {
    // let currentTime = new Date();

    const endTime = moment().format("HH:mm");
    this.addCCMEncounterDto.endTime = endTime;
    if (this.addCCMEncounterDto.duration) {
      // let startTime = moment(this.addCCMEncounterDto.startTime, 'hh:mm');

      this.calculateTime();
    }
    // if (currentTime.getHours() > 12) {
    //   this.addCCMEncounterDto.endTime = (currentTime.getHours() - 12) + ':' + currentTime.getMinutes();
    // } else {
    //   this.addCCMEncounterDto.endTime = currentTime.getHours() + ':' + currentTime.getMinutes();
    // }
  }
  calculateTime() {
    const CurrentTime = moment(this.addCCMEncounterDto.endTime, "HH:mm");
    if (this.addCCMEncounterDto.duration) {
      // if (this.addCCMEncounterDto.duration >= 60) {
      //   var hours = Math.floor(this.addCCMEncounterDto.duration / 60);
      //   var minutes = this.addCCMEncounterDto.duration % 60;
      //   let duration = moment(hours + ':' + minutes, 'hh:mm');
      //   this.myduration = duration;
      // } else {
      //   let duration = moment(this.addCCMEncounterDto.duration, 'mm');
      //   this.myduration = duration;
      // }
      if (this.addCCMEncounterDto.duration > 59) {
        this.addCCMEncounterDto.duration = null;
        this.addCCMEncounterDto.startTime = null;
        return;
      }
      const duration = moment(this.addCCMEncounterDto.duration, "mm");
      this.myduration = duration;
      const startTime = moment.duration(CurrentTime.diff(this.myduration));
      const newTime =
        startTime.hours().toString() + ":" + startTime.minutes().toString();
      this.addCCMEncounterDto.startTime = moment(newTime, "HH:mm").format(
        "HH:mm"
      );
      // console.log(`start : ${this.addCCMEncounterDto.startTime}  end : ${this.addCCMEncounterDto.endTime}`)
      // this.myduration = moment(this.myduration % 60);
      // if (startTime.hours() > 12) {
      //   const calculatestartTime = moment(startTime.hours() - 12);

      //   this.addCCMEncounterDto.startTime = moment(
      //     calculatestartTime + ':' + startTime.minutes().toString(),
      //     'HH:mm'
      //   ).format('HH:mm');
      // } else {
      //   this.addCCMEncounterDto.startTime = moment(
      //     startTime.hours().toString() + ':' + startTime.minutes().toString(),
      //     'HH:mm'
      //   ).format('HH:mm');
      // }
    }
    if (this.addCCMEncounterDto.duration < 0) {
      this.toaster.warning("Invalid duration entered");
      this.addCCMEncounterDto.duration = null;
      return;
    }
  }
  calculateDuration() {
    if (this.addCCMEncounterDto.startTime) {
      const startTime = moment(this.addCCMEncounterDto.startTime, "HH:mm");
      const endTime = moment(this.addCCMEncounterDto.endTime, "HH:mm");
      const calculateDuration = moment.duration(endTime.diff(startTime));
      this.addCCMEncounterDto.duration =
        calculateDuration.hours() * 60 + calculateDuration.minutes();
      if (this.addCCMEncounterDto.duration < 0) {
        this.toaster.warning("Invalid start/end time entered");
        this.addCCMEncounterDto.duration = null;
        return;
      }
    }
  }
  resetCcmEncounterlist() {
    this.addCCMEncounterDto.note = "";
    this.addCCMEncounterDto.ccmServiceTypeId = 8;
    this.addCCMEncounterDto.startTime = "";
    this.addCCMEncounterDto.endTime = "";
    this.addCCMEncounterDto.duration = null;
  }

  addEncounter() {
    this.isLoading = true;
    if (!this.addCCMEncounterDto.endTime) {
      this.durationChanged(this.addCCMEncounterDto.duration);
    }
    if (!this.validaeTimeDifference()) {
      this.isLoading = false;
      this.showAlertFEncounter = true;
      setTimeout(() => {
        this.showAlertFEncounter = false;
      }, 5000);
      return;
    }
    this.addCCMEncounterDto.encounterDate = moment().format("YYYY-MM-DD");
    this.addCCMEncounterDto.appAdminId =
      this.securityService.securityObject.id;
    this.addCCMEncounterDto.careProviderId =
      this.securityService.securityObject.id;
      this.addCCMEncounterDto.patientId = this.patient.id
    this.ccmService
      .addCCMEncounter(
        this.addCCMEncounterDto,
        this.PatientEncounterMonthlyStatus
      )
      .subscribe(
        (res: AddCcmEncounterDto) => {
          this.addEncounterModal.hide();
          this.isLoading = false;
          const encounterObj = this.cloner.deepClone(this.addCCMEncounterDto);
          this.refreshCcmPatientsList(encounterObj);
          // this.filterPatients();
          this.addCCMEncounterDto = {
            id: 0,
            startTime: "",
            endTime: "",
            ccmServiceTypeId: 0,
            careProviderId: 0,
            patientId: 0,
            appAdminId: 0,
            duration: 0,
            encounterDate: "",
            note: "",
            patientCommunicationIds: []
          };
          this.encounterSaved.emit()
          // this.GetMonthlyCcmData();
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
          this.isLoading = false;
        }
      );
  }
  refreshCcmPatientsList(encounterObj){
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.CommunicationEncounterEdit;
    emitObj.value = {
      type: EventTypes.CommunicationEncounterEdit.toString(),
      data: {
        patientId: this.addCCMEncounterDto.patientId,
        patientCommunicationIds: this.addCCMEncounterDto.patientCommunicationIds,
        serviceType: TwoCModulesEnum.CCM,
        encounterObj: encounterObj
      },
    };
    this.eventBus.emit(emitObj);
  }
  startStopWatch() {
    this.stopWatchValue = 0;
    this.stopWatchInterval  = setInterval(() => {
      ++this.stopWatchValue;
      const result = moment().startOf('day').seconds(this.stopWatchValue).format('HH:mm:ss');
      document.getElementById('stopwatchFieldCCM1')?.setAttribute('value',result);
    }, 1000);
  }
  ResetStopWatch() {
    this.addCCMEncounterDto.duration =  moment().startOf('day').seconds(this.stopWatchValue).minutes();
    if ((this.stopWatchValue % 60) > 0) {
      this.addCCMEncounterDto.duration = (this.addCCMEncounterDto.duration + 1);
    }
    if (!this.addCCMEncounterDto.duration) {
      this.addCCMEncounterDto.duration = null;
    }
    clearInterval(this.stopWatchInterval);
    this.stopWatchInterval = null;
    document.getElementById('stopwatchFieldCCM1')?.setAttribute('value','');
    this.durationChanged(this.addCCMEncounterDto.duration);
  }
  ccmEncounterModalOpened() {
    this.startStopWatch();
  }
  validaeTimeDifference(): boolean {
    const sTime = moment(this.addCCMEncounterDto.startTime, "HH:mm");
    const eTime = moment(this.addCCMEncounterDto.endTime, "HH:mm");
    const res = sTime.isBefore(eTime);
    return res;
  }
  durationChanged(minsToAdd: any) {
    // if (!this.addCCMEncounterDto.startTime) {
    //   const duration = moment(this.addCCMEncounterDto.duration, 'mm').format('hh:mm:ss');
    //   const currentTime = moment(moment().format('hh:mm:ss'), 'hh:mm:ss');
    //   const result = moment.duration(currentTime.diff(duration));
    // }
    const startTime = this.addCCMEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? "0" : "") + J;
    }
    const piece: any = startTime.split(":");
    const mins: any = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
    this.addCCMEncounterDto.endTime = newTime;
  }
  IsCCMCompleted(timeCompleted: string) {
    const hours = +timeCompleted.split(":")[0];
    const minutes = +timeCompleted.split(":")[1];
    if (minutes >= 20 || hours > 0) {
      return true;
    } else {
      return false;
    }
  }
}
