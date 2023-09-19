import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import moment from "moment";
import {
  MdbTableDirective,
  ModalDirective,
  PageScrollService,
  ToastService,
} from "ng-uikit-pro-standard";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { AppUiService } from "src/app/core/app-ui.service";
import { BhiService } from "src/app/core/bhi.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { ClonerService } from "src/app/core/cloner.service";
import { CustomeListService } from "src/app/core/custome-list.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { DataStorageService } from "src/app/core/data-storage.service";
import { EmitEvent, EventBusService, EventTypes } from "src/app/core/event-bus.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { PubnubChatService } from "src/app/core/pubnub-chat.service";
import { RpmService } from "src/app/core/rpm.service";
import { SecurityService } from "src/app/core/security/security.service";
import { RpmMonthlyStatus } from "src/app/Enums/filterPatient.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { SetFacilityServiceConfigDto } from "src/app/model/Facility/facility.model";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { TwoCModulesEnum } from "src/app/model/productivity.model";
import {
  RmpDashboardDataDto,
  RmpDashboardParamsDto,
  RPMEncounterDto,
  RpmPatientsListDto,
  RpmPatientsScreenParams,
} from "src/app/model/rpm.model";
import { AlertReason, RpmAlertListDto } from "src/app/model/rpm/rpmAlert.model";
import { TwoCTextAreaComponent } from "src/app/utility/two-c-text-area/two-c-text-area.component";

@Component({
  selector: "app-rpm-quick-encounter",
  templateUrl: "./rpm-quick-encounter.component.html",
  styleUrls: ["./rpm-quick-encounter.component.scss"],
})
export class RpmQuickEncounterComponent implements OnInit {
  @ViewChild("myFIeldRefRPM") myFIeldRefRPM: TwoCTextAreaComponent;
  @ViewChild("tableEl2") tableEl2: MdbTableDirective;
  @ViewChild("tableEl1") tableEl1: MdbTableDirective;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild("rpmEncounterModal") rpmEncounterModal: ModalDirective;
  @Output() encounterSaved = new EventEmitter();
  public datePickerConfig1: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD hh:mm A",
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "hh:mm",
  };
  hideTimerForChatEncounter = false;
  outOfRangeAddressedCount: number;
  timeLapseAddressedCount: number;
  facilityId: number;
  stopWatchValue: number;
  stopWatchInterval: NodeJS.Timeout;
  rpmEncounterDto = new RPMEncounterDto();
  patientEncounterMonthlyStatusAcknowledge = false;
  selectedPatient = new RpmPatientsListDto();
  rpmMonthlyStatusEnum = RpmMonthlyStatus;
  isAddEncounter: boolean;
  isAlertLoading: boolean;
  selectedRpmAlert = new RpmPatientsListDto();
  rpmAlertListDto = new Array<RpmAlertListDto>();
  rpmAlertListOutOfRange = new Array<RpmAlertListDto>();
  rpmAlertListTimeLapse = new Array<RpmAlertListDto>();
  CareCordinatorId = 0;
  CareFacilitatorId = 0;
  selectedDate = moment().format("YYYY-MM");
  rmpDashboardDataDto = new RmpDashboardDataDto();
  rpmMonthlyStatusEnumList =
    this.filterDataService.getEnumAsList(RpmMonthlyStatus);
  filterPatientDto = new RpmPatientsScreenParams();
  isLoading: boolean;
  rpmStatus = 0;
  patient: PatientDto;
  PatientEncounterMonthlyStatus = RpmMonthlyStatus["Not Started"];
  PatientEncounterMonthlyStatusTExt =
    RpmMonthlyStatus[RpmMonthlyStatus["Not Started"]];
  PatientEncounterMonthlyStatusAcknowledge = false;
  isLoadingServiceConfig: boolean;
  SetFacilityServiceCOnfigDto = new SetFacilityServiceConfigDto();
  rpmEncounterDuration= '';
  rpmEncounterTime: any;

  constructor(
    public securityService: SecurityService,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private rpmService: RpmService,
    private facilityService: FacilityService,
    private filterDataService: DataFilterService,
    private cloner: ClonerService,
    private eventBus: EventBusService,
    private ccmService: CcmDataService
  ) {}

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.GetFacilityServiceConfig()
    this.SubscribeOpenModalRequest();
    this.getRpmEncounterTime();
  }
  SubscribeOpenModalRequest() {
    this.eventBus.on(EventTypes.OpenRPMQuickEncounter).subscribe((res: { type: string, data: { patient: PatientDto, encounterObj: RPMEncounterDto, config:{hideTimer: boolean},alerts?: RpmAlertListDto}}) => {
      if (res.type == EventTypes.OpenRPMQuickEncounter.toString()) {
        if(res.data?.config?.hideTimer){
          this.hideTimerForCommunicationQuickEncounter(res?.data?.patient);
        }
        this.OpenAddEncounterModal(res.data?.patient, res.data?.encounterObj, res.data?.alerts)
      }
    });
  }
  hideTimerForCommunicationQuickEncounter(patient: PatientDto){
    this.hideTimerForChatEncounter = true;
    if(patient.rpmMonthlyStatus != RpmMonthlyStatus.Completed){
      patient.rpmMonthlyStatus = RpmMonthlyStatus["Partially Completed"];
      this.selectedPatient.rpmMonthlyStatus = RpmMonthlyStatus["Partially Completed"];
    }
    this.patientEncounterMonthlyStatusAcknowledge = true;
  }
  rpmEncounterModalOpened() {
    this.startStopWatch();
  }
  GetFacilityServiceConfig() {
    if (!this.facilityId) {
      return;
    }
    this.isLoadingServiceConfig = true;
    this.facilityService.GetFacilityServiceConfig(this.facilityId).subscribe(
      (res: SetFacilityServiceConfigDto) => {
        this.SetFacilityServiceCOnfigDto = res;
        this.isLoadingServiceConfig = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingServiceConfig = false;
      }
    );
  }
  startStopWatch() {
    this.stopWatchValue = 0;
    this.stopWatchInterval = setInterval(() => {
      ++this.stopWatchValue;
      const result = moment()
        .startOf("day")
        .seconds(this.stopWatchValue)
        .format("HH:mm:ss");
      document
        .getElementById("stopwatchFieldRPM2")
        .setAttribute("value", result);
    }, 1000);
  }
  ResetStopWatch() {
    this.rpmEncounterDuration = moment()
      .startOf("day")
      .seconds(this.stopWatchValue)
      .minutes()
      .toString();
    if (this.stopWatchValue % 60 > 0) {
      this.rpmEncounterDuration = (
        this.rpmEncounterDuration + 1
      ).toString();
    }
    if (!+this.rpmEncounterDuration) {
      this.rpmEncounterDuration = null;
    }
    clearInterval(this.stopWatchInterval);
    this.stopWatchInterval = null;
    document.getElementById("stopwatchFieldRPM2")?.setAttribute("value", "");
    this.durationChanged(this.rpmEncounterDuration);

    this.FillNoteText("");
  }
  durationChanged(minsToAdd: any) {
    const startTime = this.rpmEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? "0" : "") + J;
    }
    const piece = startTime.split(":");
    const mins = +piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
    this.rpmEncounterDto.endTime = newTime;
  }
  FillNoteText(text: string) {
    if (this.myFIeldRefRPM?.FillValue) {
      this.myFIeldRefRPM.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefRPM?.FillValue) {
          this.myFIeldRefRPM.FillValue(text);
        }
      }, 1000);
    }
  }
  addRpmEncounter(rpmEncounterModal?: ModalDirective) {
    this.isAddEncounter = true;

    this.rpmEncounterDto.patientId = this.patient.id;

    this.rpmEncounterDto.facilityUserId =
      this.securityService.securityObject.id;
    const cDuration = +this.rpmEncounterDuration
    const hours = Math.floor(+this.rpmEncounterDuration / 60);
    const minutes = +this.rpmEncounterDuration % 60;
    this.rpmEncounterDto.duration = hours + ":" + minutes;
    if (hours > 0) {
      this.rpmEncounterDto.duration = moment(
        this.rpmEncounterDto.duration,
        "h:m"
      ).format("hh:mm");
    }
    // this.rpmEncounterDto.note = this.rpmEncounterDto.note + ' ' + this.disclaimer;
    this.rpmService.addRPMEncounter(this.rpmEncounterDto).subscribe(
      (res) => {
        this.isAddEncounter = false;
        const encounterObj = this.cloner.deepClone<RPMEncounterDto>(this.rpmEncounterDto);
        encounterObj.duration = cDuration as any
        this.refreshRpmPatientsList(encounterObj);
        rpmEncounterModal.hide();
        if (this.rpmEncounterDto) {
          this.rpmEncounterDto = new RPMEncounterDto();
        }
        this.toaster.success("Rpm Encounter Added Successfully");
        this.encounterSaved.emit();
      },
      (error: HttpResError) => {
        this.isAddEncounter = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  refreshRpmPatientsList(rpmEncounterDto: RPMEncounterDto){
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.CommunicationEncounterEdit;
    emitObj.value = {
      type: EventTypes.CommunicationEncounterEdit.toString(),
      data: {
        patientId: rpmEncounterDto.patientId,
        patientCommunicationIds: rpmEncounterDto.patientCommunicationIds,
        serviceType: TwoCModulesEnum.RPM,
        encounterObj: rpmEncounterDto
      },
    };
    this.eventBus.emit(emitObj);
  }
  CalculateAddressedCOunt() {
    this.outOfRangeAddressedCount = 0;
    this.timeLapseAddressedCount = 0;
    this.rpmAlertListOutOfRange.forEach((element) => {
      if (element.addressedById) {
        this.outOfRangeAddressedCount = this.outOfRangeAddressedCount + 1;
      }
    });
    this.rpmAlertListTimeLapse.forEach((element) => {
      if (element.addressedById) {
        this.timeLapseAddressedCount = this.timeLapseAddressedCount + 1;
      }
    });
  }
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new RpmPatientsScreenParams();
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
      }
    }
  }
  OpenAddEncounterModal(patient: PatientDto, encounterDetail?: RPMEncounterDto, alert?: RpmAlertListDto) {

    this.patient = patient;
    this.rpmEncounterDto = new RPMEncounterDto();
    this.PatientEncounterMonthlyStatus = RpmMonthlyStatus["Not Started"];
    this.PatientEncounterMonthlyStatusTExt =
    RpmMonthlyStatus[patient.rpmMonthlyStatus];
    this.rpmEncounterDto.startTime = moment().format("hh:mm");
    this.rpmEncounterDto.encounterDate = moment().format("YYYY-MM-DD");
    this.PatientEncounterMonthlyStatusAcknowledge = false;
    this.rpmEncounterDto.patientId = patient.id;
    if (encounterDetail) {
      this.rpmEncounterDto.rpmServiceType = encounterDetail.rpmServiceType;
      this.rpmEncounterDuration = encounterDetail.duration;
      this.rpmEncounterDto.note = encounterDetail.note;
      this.rpmEncounterDto.patientCommunicationIds = encounterDetail.patientCommunicationIds || [];
      this.durationChanged(encounterDetail.duration)
      this.FillNoteText(encounterDetail.note)
    }

    if (!this.SetFacilityServiceCOnfigDto.autoTimeCapture && alert) {
      console.log(`Auto capture is disabled for this facility`)
      return;
    }
    if (this.SetFacilityServiceCOnfigDto.autoTimeCapture && alert) {
      if (alert.alertReason == AlertReason.OutOfRange) {
        this.rpmEncounterDto.duration = this.SetFacilityServiceCOnfigDto.outOfRangeAlertDuration as any;
      }
      if (alert.alertReason == AlertReason.NotReceived) {
        this.rpmEncounterDto.duration = this.SetFacilityServiceCOnfigDto.timeLapseAlertDuration as any;
      }
    }

    this.assignUserValues();
    this.rpmEncounterModal.show();
  }
  getRpmEncounterTime() {
    const rpmMonthId = moment(this.selectedDate, "YYYY-MM").month() + 1;
    const rpmYearId = moment(this.selectedDate, "YYYY-MM").year();
    this.ccmService
      .GetRpmEncountersDurationByPatientId(
        this.selectedPatient.id,
        rpmMonthId,
        rpmYearId
      )
      .subscribe(
        (res: any) => {
          if (res.duration) {
            this.rpmEncounterTime = res.duration;
          } else {
            this.rpmEncounterTime.duration = "00:00:00";
          }
        },
        (error) => {
          this.rpmEncounterTime = "00:00:00";
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
}
