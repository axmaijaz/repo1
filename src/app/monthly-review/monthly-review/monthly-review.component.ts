import {
  CcmStatusChangeDto,
  consentDto,
  PatientConsents,
  PatientDto,
} from "src/app/model/Patient/patient.model";
import { DataFilterService } from "src/app/core/data-filter.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  HostListener,
} from "@angular/core";
import { Location, DatePipe } from "@angular/common";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { SubSink } from "src/app/SubSink";
import { ProviderDto } from "src/app/model/Provider/provider.model";
import { CcmServiceType } from "src/app/model/Questionnaire/Questionnire.model";
import * as FileSaver from "file-saver";
import {
  CcmEncounterForList,
  CcmEncounterListDto,
  CCMValidityStatusDto,
  ChangeMonthlyCcmStatus,
} from "src/app/model/admin/ccm.model";
// import moment from 'moment';
import * as moment from "moment";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { SecurityService } from "src/app/core/security/security.service";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { AppDataService } from "src/app/core/app-data.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { MrAdminService } from "src/app/core/mr-admin.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  MRProblem,
  MRType,
  MRGoal,
  MRIntervention,
} from "src/app/model/MonthlyReview/mReview.model";
import {
  MRProblemStatus,
  MRGoalStatus,
  MRInterventionStatus,
} from "src/app/model/MonthlyReview/mReview.enum";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { PcmService } from "src/app/core/pcm/pcm.service";
import {
  MeasureDto,
  PcmMeasureDataObj,
  Status,
  DocDataDto,
  EditMeasureDataParams,
} from "src/app/model/pcm/pcm.model";
import { DomSanitizer } from "@angular/platform-browser";
import { AwService } from "src/app/core/annualWellness/aw.service";
import { AMScreeningDto } from "src/app/model/pcm/pcm-alcohol.model";
import { AwsService } from "src/app/core/aws/aws.service";
import { environment } from "src/environments/environment";
import { CcmMonthlyStatus } from "src/app/Enums/filterPatient.enum";
import { PatientConsentService } from "src/app/core/Patient/patient-consent.service";
import { TwoCTextAreaComponent } from "src/app/utility/two-c-text-area/two-c-text-area.component";
@Component({
  selector: "app-monthly-review",
  templateUrl: "./monthly-review.component.html",
  styleUrls: ["./monthly-review.component.scss"],
})
export class MonthlyReviewComponent implements OnInit, OnDestroy {
  @ViewChild("listItems", { read: ElementRef })
  public listItems: ElementRef<any>;
  private subs = new SubSink();
  notesRowSize = 3;
  providerList = new Array<ProviderDto>();
  encounterTimeForm: FormGroup;
  serviceTypes = new Array<CcmServiceType>();
  ccmEncounterList: CcmEncounterForList;
  @ViewChild("tabCloseModal") tabCloseModal: ModalDirective;
  @ViewChild("ccmConsentModal") ccmConsentModal: ModalDirective;
  @ViewChild("ccmStatusChangeReasonModal") ccmStatusChangeReasonModal: ModalDirective;
  @ViewChild("addMREncounterWarning")
  addMREncounterWarningModal: ModalDirective;
  objectURLStrAW: string;
  @ViewChild("viewPdfModal") viewPdfModal: ModalDirective;
  timerStart = false;
  listOfYears = [];
  yearNum: number;
  consentDate: string;
  activeProblemIds = new Array<number>();
  currentMonth: number = new Date().getMonth() + 1;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    appendTo: "body",
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "hh:mm",
  };
  showAlertFEncounter: boolean;
  addingEncounter: boolean;
  loading: boolean;
  PatientId: number;
  showValidationAlert: string;
  followUpDate: string;
  @ViewChild("timerInput") TimerInput: ElementRef;
  @ViewChild("durationInput") durationInput: ElementRef;
  @ViewChild("timerInput1") TimerInput1: ElementRef;
  @ViewChild("startTimerModal") startTimerModal: ModalDirective;
  firstimeTimerStart = true;
  myInterval = -1;
  public dropdownScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside",
  };
  seconds = 0;
  minutes = 0;
  hours = 0;
  stopCounterOnDuration = true;
  facilityId: number;
  gettingEncounterLogs: boolean;
  isLoadingProblems = true;
  isLoadingTypes: boolean;
  mrTypeList: MRType[];
  mrProblemsList: MRProblem[];
  displayGoalsList: MRGoal[];
  tempDisplayGoalsList: MRGoal[];
  selectedmrType: number;
  // tempArr: any[];
  mRProblemStatusList = this.getEnumAsList(MRProblemStatus);
  mRGoalStatusList = this.getEnumAsList(MRGoalStatus);
  mRInterventionStatusList = this.getEnumAsList(MRInterventionStatus);
  mRInterventionStatusEnum = MRInterventionStatus;
  gettingMRPdf: boolean;
  disableCounterTime: boolean;
  gettingMRPatientPdf: boolean;

  gettingGetPatientsMeasuresSummary: boolean;
  pcmMeasuresList = new Array<MeasureDto>();
  pcmMeasuresListGap = new Array<MeasureDto>();
  pcmMeasuresListNotGap = new Array<MeasureDto>();
  ListGApWidth: number;
  ListGApNotWidth: number;
  currentCode: string;
  pcmModelLoading: boolean;
  pcmMOdelData = new PcmMeasureDataObj();
  tempStatusList = new Array<Status>();
  selectedGapStatus: { name: string; value: number };
  whoIsCovered: any;
  selectedMeasure = new MeasureDto();
  editingPcmData: boolean;
  isCreatingAWEncounter: boolean;
  isCreatingScreening: boolean;
  isCreatingCounselling: boolean;
  uploadImg: boolean;
  docData = new DocDataDto();
  popupQustion: any;
  isMinimized = true;
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "minimal-dark",
    scrollInertia: 0,
  };
  hasPayerGap: boolean;
  hasFacilityGap: boolean;
  CcmMonthlyStatusList = this.filterDataService.getEnumAsList(CcmMonthlyStatus);
  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  ccmStatusList: any;
  isLoadingPatient: boolean;
  PatientData = new PatientDto();

  ccmStatusChangeDto = new CcmStatusChangeDto();
  ccmMonthlyStatusChangeDto = new ChangeMonthlyCcmStatus();
  zIndex = "2000";
  position = { x: 50, y: 50 };
  myBounds: HTMLElement;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true,
  };
  encounterActivityLogText = "";
  gettingConsentDetails: boolean;
  listOfConsents: consentDto;
  addingCOnsent: boolean;
  uploadingCCMCOnsentDoc: boolean;
  PatientEncounterMonthlyStatusAcknowledge = false;
  PatientEncounterMonthlyStatus = CcmMonthlyStatus["Not Started"];
  PatientEncounterMonthlyStatusTExt =
    CcmMonthlyStatus[CcmMonthlyStatus["Not Started"]];
  @ViewChild("myFIeldRefMR") myFIeldRefMR: TwoCTextAreaComponent;
  viewType = "assessment";
  durationValid: boolean;
  changingCCMStatus: boolean;
  isIframe: boolean;
  @ViewChild('myFIeldRefCCM') myFIeldRefCCM: TwoCTextAreaComponent;

  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHander(event) {
    if (this.timerStart || this.encounterTimeForm.get("endTime").value) {
      return false;
    } else {
      return true;
    }
  }
  constructor(
    private location: Location,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private appUi: AppUiService,
    private patientsService: PatientsService,
    private mrService: MrAdminService,
    private facilityService: FacilityService,
    private ccmService: CcmDataService,
    private securityService: SecurityService,
    private questionService: QuestionnaireService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private filterDataService: DataFilterService,
    private patientConsentService: PatientConsentService,
    private sanatizer: DomSanitizer,
    private pcmService: PcmService,
    private awService: AwService,
    private awsService: AwsService,
    private appDataService: AppDataService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit() {
    this.myBounds = document.getElementById("myBoundsId") as HTMLElement;
    this.yearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    // this.GetPatientsMeasuresSummary();
    this.encounterTimeForm = this.fb.group({
      id: 0,
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      encounterDate: [
        this.datePipe.transform(new Date(), "yyyy-MM-dd"),
        Validators.required,
      ],
      note: [""],
      ccmServiceTypeId: [null, Validators.required],
      patientId: this.PatientId,
      appAdminId: 1,
      careProviderId: [null, Validators.required],
      careProviderName: "",
    });

    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.facilityId = 0;
    }

    this.subs.sink = this.questionService.getServiceTypeList(false).subscribe(
      (res: any) => {
        // this.startTimerModal.show();
        // this.disableCounterTime = false;
        this.startTimer();
        this.serviceTypes = res;
        this.serviceTypes.forEach((element) => {
          if (element.name === "Monthly Clinical Review") {
            this.encounterTimeForm.get("ccmServiceTypeId").setValue(element.id);
          }
        });
      },
      (err) => {
        // console.log(err);
      }
    );
    // this.GetTypes();
    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
    this.encounterTimeForm
                .get("careProviderId")
                .setValue(this.securityService.securityObject.id);
    // this.loadProviders();
    this.getCcmStatus();
    this.getPatientData();
    this.getPatientConsentsByPId();
    this.isIframe = this.route.snapshot.queryParamMap.get('isIframe') ? true : false;
  }
  getPatientData() {
    this.isLoadingPatient = true;
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: PatientDto) => {
            if (res) {
              this.isLoadingPatient = false;
              this.PatientData = res;
              this.PatientEncounterMonthlyStatus =
                this.PatientData.ccmMonthlyStatus;
              this.PatientEncounterMonthlyStatusTExt =
                this.ccmMonthlyStatusEnum[this.PatientData.ccmMonthlyStatus];

              // this.PatientData.chronicDiseasesIds
            }
          },
          (error) => {
            this.isLoadingPatient = false;
            // console.log(error);
          }
        );
    }
  }
  AssignCcmStatus() {
    this.changingCCMStatus = true;
    this.ccmStatusChangeDto.appUserId =
      this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = this.PatientData.id;
    this.ccmStatusChangeDto.newStatusValue = this.PatientData.ccmStatus;
    this.subs.sink = this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        (res) => {
          this.changingCCMStatus = false;
          this.toaster.success("Ccm Status Changed Successfully");
          this.ccmStatusChangeReasonModal.hide();
        },
        (error: HttpResError) => {
          this.changingCCMStatus = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  AssignCcmMonthlyStatus() {
    this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus =
      this.PatientData.ccmMonthlyStatus;
    this.ccmMonthlyStatusChangeDto.PatientId = this.PatientData.id;
    this.subs.sink = this.patientsService
      .editPatientCcmMonthlyStatus(this.ccmMonthlyStatusChangeDto)
      .subscribe(
        (res) => {
          this.PatientEncounterMonthlyStatus =
            this.PatientData.ccmMonthlyStatus;
          this.PatientEncounterMonthlyStatusTExt =
            this.ccmMonthlyStatusEnum[this.PatientData.ccmMonthlyStatus];
          this.toaster.success("Ccm Monthly Status Changed Successfully");
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
        }
      );
  }
  navigateBack() {
    if (this.timerStart || this.encounterTimeForm.get("endTime").value) {
      this.tabCloseModal.show();
      return;
    }
    this.location.back();
  }
  getEnumAsList<T>(model: T): Array<{ name: string; value: number }> {
    const keys = Object.keys(model).filter(
      (k) => typeof model[k as any] === "number"
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      name: key,
      value: model[key as any],
    })); // [0, 1]
    return values;
  }
  durationChanged(minsToAdd: number) {
    const startTime = this.encounterTimeForm.get("startTime").value;
    function D(J) {
      return (J < 10 ? "0" : "") + J;
    }
    const piece = startTime.split(":");
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
    this.encounterTimeForm.get("endTime").setValue(newTime);
    this.durationValid = false;
    if (+minsToAdd > 0) {
      this.durationValid = true;
    }
  }
  SubmitEncounterTimeForm = () => {
    this.showValidationAlert = "";
    if (this.timerStart) {
      this.stopTimer();
    }
    // const encounterDate = this.encounterTimeForm.get('encounterDate').value;
    // const splitedarray = encounterDate.split('-');
    // const actualDate =
    //   splitedarray[1] + '-' + splitedarray[0] + '-' + splitedarray[2];
    // this.encounterTimeForm.get('encounterDate').setValue(actualDate);
    const a = this.encounterTimeForm.value;
    if (!this.validaeTimeDifference(a)) {
      this.showAlertFEncounter = true;
      setTimeout(() => {
        this.showAlertFEncounter = false;
      }, 5000);
      return;
    }
    if (this.sumEncounterstime() >= 20) {
      a["isMonthlyStatusValid"] = true;
    }
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService
      .addCCMEncounter(a, this.PatientEncounterMonthlyStatus)
      .subscribe(
        (res: CcmEncounterListDto) => {
          this.PatientData.ccmMonthlyStatus =
            this.PatientEncounterMonthlyStatus;
          this.PatientEncounterMonthlyStatusAcknowledge = false;
          this.loading = false;
          this.addingEncounter = false;
          this.encounterTimeForm.get("startTime").setValue("");
          this.encounterTimeForm.get("endTime").setValue("");
          this.encounterTimeForm.get("note").setValue("");
          this.encounterTimeForm.get("ccmServiceTypeId").setValue(null);
          this.resetFields();
          this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
          // this.ccmEncounterList.ccmEncountersList.unshift(res);
        },
        (err) => {
          this.encounterTimeForm.get("startTime").setValue("");
          this.encounterTimeForm.get("endTime").setValue("");
          this.encounterTimeForm.get("note").setValue("");
          this.FillNoteTextCCM(this.encounterTimeForm.get("note").value)
          this.toaster.error(err.message, err.error || err.error);
          this.loading = false;
          this.addingEncounter = false;
        }
      );
  };
  getCcmStatus() {
    this.subs.sink = this.patientsService
      .getCcmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.ccmStatusList = res;
        }
      });
  }
  validaeTimeDifference(a): boolean {
    const sTime = moment(a.startTime, "HH:mm");
    const eTime = moment(a.endTime, "HH:mm");
    const res = sTime.isBefore(eTime);
    return res;
  }
  loadProviders() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.subs.sink = this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any[]) => {
          if (res) {
            this.providerList = res;
            const user = this.providerList?.find(
              (x) => x.id === this.securityService.securityObject.id
            );
            if (user) {
              this.encounterTimeForm
                .get("careProviderId")
                .setValue(this.securityService.securityObject.id);
            }
          }
        },
        (error) => {
          // console.log(error);
        }
      );
  }
  getLogsByPatientAndMonthId(patientId, monthId) {
    if (patientId && monthId) {
      this.gettingEncounterLogs = true;
      this.subs.sink = this.ccmService
        .getCCMEncounterByPatientId(patientId, monthId, this.yearNum)
        .subscribe(
          (res) => {
            this.gettingEncounterLogs = false;
            this.ccmEncounterList = res;
            this.consentDate = this.datePipe.transform(
              this.ccmEncounterList.consentDate,
              "mediumDate"
            );
            this.followUpDate = this.datePipe.transform(
              this.ccmEncounterList.followUpDate,
              "mediumDate"
            );
          },
          (err) => {
            this.gettingEncounterLogs = false;
          }
        );
    } else {
      this.gettingEncounterLogs = false;
    }
  }
  searchLogsByMonth() {
    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
  }
  startTimer() {
    this.durationInput.nativeElement.value = null;
    if (this.firstimeTimerStart) {
      const date = moment().format("hh:mm");
      this.encounterTimeForm.get("startTime").setValue(date);
      this.encounterTimeForm.get("endTime").setValue("");
      this.firstimeTimerStart = false;
    }
    this.myInterval = <any>setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
        if (this.minutes === 60) {
          this.hours++;
          this.minutes = 0;
          if (this.hours === 24) {
            this.hours = 0;
          }
        }
      }
      this.TimerInput.nativeElement.value = this.getTimerTime(
        this.seconds,
        this.minutes,
        this.hours
      );
      this.TimerInput1.nativeElement.value = this.getTimerTime(
        this.seconds,
        this.minutes,
        this.hours
      );
    }, 600);
    this.timerStart = true;
  }
  pauseTimer() {
    clearInterval(this.myInterval);
    this.myInterval = -1;
    this.timerStart = false;
  }
  stopTimer() {
    this.pauseTimer();
    let startTime = this.encounterTimeForm.get("startTime").value;
    const splitedTime = startTime?.split(":");
    // tslint:disable-next-line:radix
    const second = parseInt(splitedTime[2]);
    // tslint:disable-next-line:radix
    const minute = parseInt(splitedTime[1]);
    // tslint:disable-next-line:radix
    const hour = parseInt(splitedTime[0]);
    if (this.seconds % 60) {
      this.minutes = this.minutes + 1
    }
    let EndTime = hour + this.hours + ":" + (minute + this.minutes);
    // + ':' +
    // (second + this.seconds);

    EndTime = moment(EndTime, "h:m").format("hh:mm");
    this.encounterTimeForm.get("endTime").setValue(EndTime);
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.TimerInput.nativeElement.value = "00:00:00";
    this.TimerInput1.nativeElement.value = "00:00:00";
    this.firstimeTimerStart = true;
    const pre = moment(startTime, "hh:mm");
    const current = moment(EndTime, "hh:mm");
    if (this.stopCounterOnDuration) {
      const result = moment.duration(current.diff(pre));
      this.durationInput.nativeElement.value =
        result.hours() * 60 + result.minutes();
    } else {
      this.stopCounterOnDuration = true;
    }
    if (+this.durationInput.nativeElement.value) {
      this.durationValid = true
    }
  }
  calculateTimeDuration() {
    this.durationValid = false;
    setTimeout(() => {
      // this.stopCounterOnDuration = true;
      let startTime = this.encounterTimeForm.get("startTime").value;
      let endTime = this.encounterTimeForm.get("endTime").value;
      if (!endTime) {
        endTime = moment().format("hh:mm");
        this.encounterTimeForm.get("endTime").setValue(endTime);
      }
      if (startTime) {
        const pre = moment(startTime, "hh:mm");
        const current = moment(endTime, "hh:mm");
        const calculateDuration = moment.duration(current.diff(pre));
        const result =
          calculateDuration.hours() * 60 + calculateDuration.minutes();
        if (result < 0) {
          this.toaster.warning("Invalid start/end time entered");
          this.durationInput.nativeElement.value = null;
          return;
        }
        this.durationInput.nativeElement.value = result;

        if (+result > 0) {
          this.durationValid = true;
        }
      }
      if (!startTime) {
        startTime = moment().format("hh:mm");
        this.encounterTimeForm.get("startTime").setValue(startTime);
      }
      // this.durationChanged(this.durationInput.nativeElement.value);
    }, 1000);
  }
  getTimerTime(seconds, minutes, hours): string {
    let times = "";
    if (hours < 10) {
      times += "0" + hours;
    } else {
      times += hours;
    }
    times += ":";
    if (minutes < 10) {
      times += "0" + minutes;
    } else {
      times += minutes;
    }
    times += ":";
    if (seconds < 10) {
      times += "0" + seconds;
    } else {
      times += seconds;
    }

    return times;
  }
  GetMRProblemsByTypeId(typeId: number) {
    this.isLoadingProblems = true;
    this.mrProblemsList = [];
    this.subs.sink = this.mrService
      .GetMRProblemsByTypeId(this.PatientId, typeId)
      .subscribe(
        (res: MRProblem[]) => {
          this.mrProblemsList = res;
          let tempArr = [];
          this.mrProblemsList.forEach((item) => {
            item["active"] = false;
            tempArr = [...tempArr, ...item.mrPatientGoals];
            // tempArr.push(item.mrPatientGoals);
          });
          this.displayGoalsList = tempArr;
          this.tempDisplayGoalsList = tempArr;
          this.isLoadingProblems = false;
          this.sortDisplayGOalsByActiveInterventions();
        },
        (error: HttpResError) => {
          this.isLoadingProblems = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  sortDisplayGOalsByActiveInterventions() {
    this.displayGoalsList?.sort((y) => {
      const hasActiveInterv = y.mrPatientInterventions.find(
        (interv) => interv.status === MRInterventionStatus.Active
      );
      if (hasActiveInterv) {
        return -1;
      }
    });
    this.displayGoalsList?.forEach((x) => {
      x.mrPatientInterventions?.sort((y) => {
        if (y.status === MRInterventionStatus.Active) {
          return -1;
        }
      });
    });
  }
  GetTypes() {
    this.isLoadingTypes = true;
    this.subs.sink = this.mrService.GetTypes().subscribe(
      (res: MRType[]) => {
        this.isLoadingTypes = false;
        this.mrTypeList = res;
        this.selectedmrType = this.mrTypeList[0].id;
        this.GetMRProblemsByTypeId(this.mrTypeList[0].id);
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  filterDisplayGoals(problem: MRProblem, checked: boolean) {
    // this.activeProblemId = problemId;
    problem["active"] = checked;

    const activeProblems = this.mrProblemsList.filter((x) => x.active === true);
    this.displayGoalsList = [];
    activeProblems.forEach((item) => {
      this.displayGoalsList = this.displayGoalsList.concat(item.mrPatientGoals);
    });
    if (this.displayGoalsList.length === 0) {
      this.displayGoalsList = this.tempDisplayGoalsList;
    }
  }
  editGoal(goal: MRGoal) {
    if (!goal.status) {
      goal.status = 0;
    }
    const data = {
      id: goal.id,
      status: goal.status,
      goalDate: goal.goalDate,
    };
    this.subs.sink = this.mrService.EditMRPatientGoal(data).subscribe(
      (res: any) => {
        //  moment(res.goalDate, 'YYYY-MMM-D h:mm:ss a')

        this.toaster.success("Data saved successfully.");
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  InterventionNoteCHanged(intrv: MRIntervention, gIndex?: number) {
    if (
      intrv.note &&
      intrv.status &&
      intrv.status === MRInterventionStatus.Active
    ) {
      this.AppendTextToEnconuterLogger(intrv.note);
    }
  }
  InterventionStatusCHanged(intrv: MRIntervention, gIndex?: number) {
    if (intrv.status && intrv.status === MRInterventionStatus.Active) {
      this.AppendTextToEnconuterLogger(intrv.encounterStatement);
    }
  }
  editIntervention(intrv: MRIntervention, gIndex?: number) {
    const statusChangedInterventions = this.displayGoalsList[
      gIndex
    ].mrPatientInterventions.filter((x) => x.status !== 0);
    if (statusChangedInterventions && statusChangedInterventions.length) {
      if (
        this.displayGoalsList[gIndex].status !== MRGoalStatus["Partially Met"]
      ) {
        this.displayGoalsList[gIndex].status = MRGoalStatus["Partially Met"];
        this.editGoal(this.displayGoalsList[gIndex]);
      }
    }
    const notCompletedInterventions = this.displayGoalsList[
      gIndex
    ].mrPatientInterventions.filter((x) => x.status !== 2);
    if (notCompletedInterventions.length == 0) {
      this.displayGoalsList[gIndex].status = MRGoalStatus.Met;
      this.editGoal(this.displayGoalsList[gIndex]);
    }
    if (!intrv.status) {
      this.displayGoalsList[gIndex].mrPatientInterventions.forEach((x) => {
        if (x.id === intrv.id) {
          x.status = 0;
        }
      });
      // intrv.status = 0;
    }
    if (intrv.status !== MRInterventionStatus["Not Started"]) {
      const currentDate = moment().format("YYYY-MM-DD");
      intrv.interventionDate = currentDate;
    }
    const data = {
      id: intrv.id,
      status: intrv.status,
      interventionDate: intrv.interventionDate,
      note: intrv.note,
    };
    if (intrv.status !== MRInterventionStatus.Active) {
      data.note = "";
    }
    this.subs.sink = this.mrService.EditMRPatientIntervention(data).subscribe(
      (res: any) => {
        this.toaster.success("Data saved successfully.");
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: CcmEncounterListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Alert";
    modalDto.Text = "Do you want to delete this encounter ?";
    // modalDto.hideProceed = true;
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (encounter: CcmEncounterListDto) => {
    this.gettingEncounterLogs = true;
    if (
      this.encounterTimeForm.get("id").value &&
      this.encounterTimeForm.get("id").value === encounter.id
    ) {
      this.AddNew();
    }
    this.ccmService.DeleteCcmEncounter(encounter.id).subscribe(
      (res) => {
        this.toaster.success("Encounter deleted successfully");
        // const index = this.ccmEncounterList.ccmEncountersList.findIndex(item => item.id === encounter.id);
        // this.ccmEncounterList.ccmEncountersList.splice(index , 1);
        this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
        this.gettingEncounterLogs = false;
      },
      (error: HttpResError) => {
        this.isLoadingTypes = false;
        this.gettingEncounterLogs = false
        this.toaster.error(error.error);
      }
    );
  };
  SeteditEncounterValues(encounter: CcmEncounterListDto) {
    this.showValidationAlert = "";
    this.encounterTimeForm.get("id").setValue(encounter.id);
    this.encounterTimeForm.get("startTime").setValue(encounter.startTime);
    this.encounterTimeForm.get("endTime").setValue(encounter.endTime);
    const date = moment(encounter.encounterDate).format("YYYY-MM-DD");
    this.encounterTimeForm.get("encounterDate").setValue(date);
    this.encounterTimeForm
      .get("careProviderId")
      .setValue(encounter.careProviderId);
    this.encounterTimeForm.get("note").setValue(encounter.note);
    this.FillNoteTextCCM(this.encounterTimeForm.get("note").value)
    this.encounterTimeForm.get("appAdminId").setValue(1);
    this.encounterTimeForm.get("patientId").setValue(this.PatientId);
    this.encounterTimeForm
      .get("ccmServiceTypeId")
      .setValue(encounter.ccmServiceTypeId);
    this.encounterTimeForm.get("careProviderName").setValue("");
    const startTime = moment(encounter.startTime, "HH:mm");
    const endTime = moment(encounter.endTime, "HH:mm");
    const calculateDuration = moment.duration(endTime.diff(startTime));
    this.durationInput.nativeElement.value =
      calculateDuration.hours() * 60 + calculateDuration.minutes();
  }
  FillNoteTextCCM(text: string) {
    if (this.myFIeldRefCCM?.FillValue) {
      this.myFIeldRefCCM.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefCCM?.FillValue) {
          this.myFIeldRefCCM.FillValue(text);
        }
      }, 1000);
    }
  }
  AddNew() {
    this.showValidationAlert = "";
    this.encounterTimeForm.get("id").setValue(0);
    const sdsd = moment().format("hh:mm");
    this.encounterTimeForm.get("startTime").setValue(sdsd);
    this.encounterTimeForm.get("endTime").setValue(null);
    const date = moment().format("YYYY-MM-DD");
    this.encounterTimeForm.get("encounterDate").setValue(date);
    // this.encounterTimeForm.get('careProviderId').setValue(null);
    this.encounterTimeForm.get("note").setValue(null);
    this.resetFields();
    // this.encounterTimeForm.get('appAdminId').setValue(1);
    this.encounterTimeForm.get("patientId").setValue(this.PatientId);
    this.serviceTypes.forEach((element) => {
      if (element.name === "Monthly Clinical Review") {
        this.encounterTimeForm.get("ccmServiceTypeId").setValue(element.id);
      }
    });
    this.encounterTimeForm.get("careProviderName").setValue("");
    this.durationInput.nativeElement.value = 0;
  }
  CopyAndPasteTOEncounter() {
    const previousVal = this.encounterTimeForm.get("note").value || "";
    this.encounterTimeForm
      .get("note")
      .setValue(previousVal + this.encounterActivityLogText);
    this.FillNoteTextCCM(this.encounterTimeForm.get("note").value)
  }
  editEncounter() {
    const a = this.encounterTimeForm.value;
    if (!this.validaeTimeDifference(a)) {
      this.showAlertFEncounter = true;
      setTimeout(() => {
        this.showAlertFEncounter = false;
      }, 5000);
      return;
    }
    if (this.sumEncounterstime() >= 20) {
      a["isMonthlyStatusValid"] = true;
    }
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService.EditCcmEncounter(a).subscribe(
      (res: CcmEncounterListDto) => {
        this.loading = false;
        this.addingEncounter = false;
        this.toaster.success("Data updated successfully");
        this.AddNew();
        // const index = this.ccmEncounterList.ccmEncountersList.findIndex(item => item.id === a.id);
        // this.ccmEncounterList.ccmEncountersList[index] = res;
        this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
        // this.ccmEncounterList.ccmEncountersList.unshift(res);
      },
      (error: HttpResError) => {
        this.toaster.error(error["statusText"], error.error || error.message);
        this.loading = false;
        this.addingEncounter = false;
      }
    );
  }
  sumEncounterstime(): number {
    const editEncounterId = this.encounterTimeForm.get("id").value;
    let totalTime = 0;
    this.ccmEncounterList.ccmEncountersList.forEach((item) => {
      if (!editEncounterId || editEncounterId !== item.id) {
        const startTime = moment(item.startTime, "HH:mm");
        const endTime = moment(item.endTime, "HH:mm");
        const calculateDuration = moment.duration(endTime.diff(startTime));
        const timeMInutes =
          calculateDuration.hours() * 60 + calculateDuration.minutes();
        totalTime = timeMInutes + totalTime;
      }
    });
    const dura = +this.durationInput.nativeElement.value;
    if (dura) {
      totalTime = totalTime + dura;
    }
    return totalTime;
  }
  //   <div class="d-flex justify-content-center">
  //   <h4 class="text-center">Do you Want to submit?</h4>
  // </div>
  GetCcmMSValidityInfo() {
    this.addingEncounter = true;
    this.subs.sink = this.ccmService.GetCcmMSValidityInfo(this.PatientId).subscribe(
      (res: CCMValidityStatusDto) => {
        var monthStr = '';
        var cpDate = '';
        if(res.carePlanDate){
          cpDate = moment(res.carePlanDate).format("M/D/YY");
          monthStr = `(${res.monthDiff}) month ago`;
        }
        this.showValidationAlert = `
        <div>

          <div class="d-flex justify-content-between">
            <p class="mb-2"><strong>Time</strong></p>
            <div>
              <strong class="ml-3">(${this.sumEncounterstime()})</strong>
              <span ${
                this.sumEncounterstime() > 19
                  ? 'class="text-primary"'
                  : 'class="text-danger"'
              }>${this.sumEncounterstime() > 19 ? "Meet" : "Not Meet"}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <p class="mb-2"><strong>Assessment</strong></p>
            <div>
              <strong class="ml-3">(${res.assessedQuestions})</strong>
              <span ${
                res.assessedQuestions > 3
                  ? 'class="text-primary"'
                  : 'class="text-danger"'
              }>${res.assessedQuestions > 3 ? "Meet" : "Not Meet"}</span>
            </div>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <p class="mb-2"><strong>Active Interventions</strong>
              <i  class="fa fa-info-circle cursor-pointer fa-lg ml-2 text-info" title="Best Practices are not included"></i>
            </p>
            <div>
              <strong class="ml-3">(${res.activeInterventions})</strong>
              <span ${
                res.activeInterventions > 0
                  ? 'class="text-primary"'
                  : 'class="text-danger"'
              }>
                ${res.activeInterventions > 0 ? "Meet" : "Not Meet"}
              </span>
            </div>
            </div>

            <div class="d-flex justify-content-between">
            <p class="mb-2"><strong>Care Plan Last Update</strong></p>
            <div>
              <strong class="ml-3">${cpDate} <span class="text-primary"> ${monthStr} </span></strong>
            </div>
            </div>
          </div>


          </div>
        </div>`;
          // this.showValidationAlert = `Time: ${this.sumEncounterstime()} , Assessed: ${res.assessedQuestions}, Active Interventions: ${res.activeInterventions} `;
          // this.showValidationAlert += '\n Do you want to submit ?';
          this.addMREncounterWarningModal.show();
          // this.showAlertMessage();
          this.addingEncounter = false;
        },
        (error: HttpResError) => {
          this.addingEncounter = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  showAlertMessage() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Alert";
    modalDto.Text = this.showValidationAlert;
    // modalDto.hideProceed = true;
    modalDto.callBack = this.SubmitEncounterTimeForm;
    modalDto.data = {};
    this.appUi.openLazyConfrimModal(modalDto);
  }
  resetFields() {
    if (this.encounterTimeForm.get("note").invalid) {
      this.encounterTimeForm.get("note").reset();
    }
    this.FillNoteTextCCM('')
    this.durationValid = false;
  }
  GetMonthlyReviewPdf() {
    this.gettingMRPdf = true;
    let nUrl = localStorage.getItem("switchLocal")
      ? environment.localBaseUrl
      : environment.baseUrl;
    nUrl = environment.appUrl;
    nUrl = nUrl + "success/loading";
    const importantStuff = window.open(nUrl);
    this.subs.sink = this.mrService
      .GetMonthlyReviewPdf(this.PatientId)
      .subscribe(
        (res: any) => {
          const file = new Blob([res], { type: "application/pdf" });
          const objectURL = window.URL.createObjectURL(file);
          importantStuff.close();
          this.objectURLStrAW = objectURL;
          this.viewPdfModal.show();
          // importantStuff.location.href = fileURL;
          // FileSaver.saveAs(
          //   new Blob([res], { type: 'application/pdf' }),
          //   `MonthlyReview.pdf`
          // );
          this.gettingMRPdf = false;
        },
        (error: HttpResError) => {
          this.gettingMRPdf = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  DownloadCarePlanPdfByPatientId() {
    this.gettingMRPatientPdf = true;
    let nUrl = localStorage.getItem("switchLocal")
      ? environment.localBaseUrl
      : environment.baseUrl;
    nUrl = environment.appUrl;
    nUrl = nUrl + "success/loading";
    const importantStuff = window.open(nUrl);
    this.subs.sink = this.mrService
      .DownloadCarePlanPdfByPatientId(this.PatientId)
      .subscribe(
        (res: any) => {
          const file = new Blob([res], { type: "application/pdf" });
          const objectURL = window.URL.createObjectURL(file);
          importantStuff.close();
          this.objectURLStrAW = objectURL;
          this.viewPdfModal.show();
          // importantStuff.location.href = fileURL;
          // FileSaver.saveAs(
          //   new Blob([res], { type: 'application/pdf' }),
          //   `PatientDoc.pdf`
          // );
          this.gettingMRPatientPdf = false;
        },
        (error: HttpResError) => {
          this.gettingMRPatientPdf = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  openConsentConfirmModal() {
    const ccmConsent = this.listOfConsents.patientConsentsDto.find(
      (x) => x.consentNature.toLowerCase() === "ccm"
    );
    if (ccmConsent && ccmConsent.isConsentTaken) {
      const modalDto1 = new LazyModalDto();
      modalDto1.Title = "Warning";
      modalDto1.Text =
        "Consent has already been taken, would you like to change it?";
      modalDto1.data = ccmConsent;
      modalDto1.callBack = this.openLazyConsentModal;
      // modalDto1.rejectCallBack = this.rejectCallBackBhi;
      // modalDto.data = data;
      this.appUi.openLazyConfrimModal(modalDto1);
    } else {
      this.openLazyConsentModal();
    }
  }
  openLazyConsentModal = () => {
    const ccmConsent = this.listOfConsents.patientConsentsDto.find(
      (x) => x.consentNature.toLowerCase() === "ccm"
    );
    const modalDto = new LazyModalDto();
    modalDto.Title = "";
    modalDto.Text = "";
    modalDto.data = ccmConsent;
    modalDto.hideProceed = true;
    modalDto.rejectCallBack = this.rejectCallBack;
    modalDto.callBack = this.openCCMCallback;
    // modalDto.data = data;
    this.appUi.openLazyConsentModal(modalDto);
  };
  rejectCallBack = () => {
    // if (this.patientCcmConsent && this.patientCcmConsent.isConsentTaken) {
    //   this.patientCcmConsentType = this.tempConsentType;
    // }
    this.getPatientConsentsByPId();
  };
  openCCMCallback = (data: any) => {
    this.addPatientConsent(data);
    this.uploadDocToS3(data);
  };
  addPatientConsent(consentData: PatientConsents) {
    this.addingCOnsent = true;
    let data = {
      patientId: consentData.patientId,
      consentType: consentData.consentType,
      signature: consentData.Signature,
      consentNature: consentData.consentNature1,
      consentDate: consentData.consentDate,
      note: consentData.note,
    };
    this.subs.sink = this.patientConsentService
      .AddPatientConsent(data)
      .subscribe(
        (res: PatientConsents[]) => {
          this.getPatientConsentsByPId();
          this.addingCOnsent = false;
          this.toaster.success("Patient Consent Taken.");
          this.getPatientConsentsByPId();
        },
        (err) => {
          // this.Signature = '';
          this.addingCOnsent = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  async uploadDocToS3(cons: PatientConsents) {
    if (cons.consentType === 1) {
      this.uploadingCCMCOnsentDoc = true;
      let myDate = new Date();
      const path = `FacilityID-${this.facilityId}/PatientConsents/CcmConsents/${cons.files.name}`;
      this.awsService.uploadUsingSdk(cons.files, path).then(
        (data) => {
          this.uploadWrittenDoc1(path, cons);
        },
        (err) => {
          this.uploadingCCMCOnsentDoc = false;
          this.toaster.error("Error while uploading image.");
        }
      );
    }
  }
  uploadWrittenDoc1(path: string, data: PatientConsents): void {
    if (data.consentType === 1) {
      // this.ccmInputLoading = true;
      this.subs.sink = this.patientsService
        .UploadCcmConsent(
          path,
          this.PatientId,
          data.consentType,
          data.consentNature1,
          data.files.name
        )
        .subscribe(
          (res) => {
            // this.ccmInputLoading = false;
            // this.files = new Array<UploadFile>();
            // this.getPatientById();
            this.getPatientConsentsByPId();
            // this.uploadFileUrl = res.fileURL;
            // this.uploadFileName = this.files[0].name;
            // this.ccmInputLoading = false;
            this.toaster.success("Consent Document Uploaded.");
            // this.getPatientById();
            // this.router.navigate(["/admin/patient/", this.patientId]);
          },
          (err) => {
            // this.preLoader = 0;
            // this.ccmInputLoading = false;
            // this.uploadFileName = "";
            // this.uploadFileName = "";
            this.toaster.error(err.error, err.message);
          }
        );
    }
  }

  getPatientConsentsByPId() {
    this.gettingConsentDetails = true;
    this.subs.sink = this.patientConsentService
      .getPatientConsentsByPatientId(this.PatientId)
      .subscribe(
        (res: consentDto) => {
          this.gettingConsentDetails = false;
          this.listOfConsents = res;
        },
        (error: HttpResError) => {
          this.gettingConsentDetails = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  AppendTextToEnconuterLogger(eData: string) {
    if (eData) {
      this.encounterActivityLogText += eData + "\n";
      this.FillNoteText(this.encounterActivityLogText);
    }
  }
  FillNoteText(text: string) {
    if (this.myFIeldRefMR?.FillValue) {
      this.myFIeldRefMR.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefMR?.FillValue) {
          this.myFIeldRefMR.FillValue(text);
        }
      }, 1000);
    }
  }
  dragFunction() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.add("body-landing-dragging");
  }
  stopFunction() {
    let body = document.getElementsByTagName("body")[0];
    body.classList.remove("body-landing-dragging");
  }
  // GetPatientsMeasuresSummary() {
  //   this.gettingGetPatientsMeasuresSummary = true;
  //   this.subs.sink = this.pcmService
  //     .GetPatientsMeasuresSummary(this.PatientId)
  //     .subscribe(
  //       (res: any) => {
  //         this.pcmMeasuresList = res;
  //         this.pcmMeasuresListGap = this.pcmMeasuresList.filter(x => x.isPayerGap);
  //         if (this.pcmMeasuresListGap.length > 0) {
  //           const arrLenth = this.pcmMeasuresListGap.length;
  //           this.ListGApWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
  //         }
  //         this.pcmMeasuresListNotGap = this.pcmMeasuresList.filter(x => !x.isPayerGap);
  //         if (this.pcmMeasuresListNotGap.length > 0) {
  //           const arrLenth = this.pcmMeasuresListNotGap.length;
  //           this.ListGApNotWidth = (arrLenth % 2) === 0 ? arrLenth / 2 : ((arrLenth + 1) / 2);
  //         }
  //         const findPayerGap = this.pcmMeasuresList.find(x => x.isPayerGap === true) ;
  //         if (findPayerGap){
  //            this.hasPayerGap = true;
  //         }
  //         const findfacilityGap = this.pcmMeasuresList.find(x => x.isPayerGap !== true) ;
  //         if (findfacilityGap){
  //            this.hasFacilityGap = true;
  //         }
  //         this.gettingGetPatientsMeasuresSummary = false;
  //         // console.log(this.pcmMeasuresList.length);
  //       },
  //       (err: HttpResError) => {
  //         this.gettingGetPatientsMeasuresSummary = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }

  // getMeasureDataByCode(code: string, model: ModalDirective) {
  //   this.currentCode = code
  //   this.pcmModelLoading = true;
  //   if (model) {
  //     model.show();
  //   }
  //   this.subs.sink = this.pcmService
  //     .GetPCMeasureData(this.PatientId, code)
  //     .subscribe(
  //       (res: PcmMeasureDataObj) => {
  //         if (res) {
  //           if (res.lastDone) {
  //             res.lastDone = moment.utc(res.lastDone).local().format('YYYY-MM-DD');
  //           }
  //           if (res.nextDue) {res.nextDue = moment.utc(res.nextDue).local().format('YYYY-MM-DD');}
  //           this.pcmMOdelData = res;
  //           this.tempStatusList = this.pcmMOdelData.statusList;
  //           this.selectedGapStatus = this.tempStatusList.find(status => status.value === this.pcmMOdelData.currentStatus);
  //           console.log(this.selectedGapStatus);
  //           this.whoIsCovered = this.sanatizer.bypassSecurityTrustHtml(
  //             this.pcmMOdelData.whoIsCovered
  //           );
  //         } else {
  //           this.pcmMOdelData = new PcmMeasureDataObj();
  //         }
  //         this.pcmModelLoading = false;
  //       },
  //       (err: HttpResError) => {
  //         if (model) {model.hide();}
  //         this.pcmModelLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // addPcDocument(file: any) {
  //   this.uploadImg = true;
  //   let data = {
  //     title: file.name,
  //     code: this.selectedMeasure.code,
  //     patientId: this.PatientId
  //   };
  //   this.pcmService.addPcDocument(data).subscribe(
  //     (res: DocDataDto) => {
  //       this.docData = res;
  //       this.uploadPcmDocToS3(file);
  //     },
  //     (err: HttpResError) => {
  //       // this.editingPcmData = false;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  // }
  // async uploadPcmDocToS3(file) {
  //   // if (this.patientRpmConsentType === 1) {
  //   // this.rpmInputLoading = true;
  //   const path = `pcmDocs/preventiveCare-${this.PatientId}/${file.name}`;
  //   this.awsService.uploadUsingSdk(file, path).then(
  //     data => {
  //       this.uploadImg = false;
  //       const newFile = {
  //         id: this.docData.id,
  //         title: file.name
  //        };
  //         this.pcmMOdelData.pcmDocuments.push(newFile);
  //       // this.getMeasureDataByCode(this.currentCode ,null);
  //     },
  //     err => {
  //       this.uploadImg = false;
  //       this.pcmService.addPCDocumentOnError(this.docData).subscribe(res => {
  //         if (res) {
  //           this.toaster.error('Error while uploading image.');
  //         }
  //       });
  //     }
  //   );
  //   // }
  // }
  // AddEditMeasureData(model: ModalDirective) {
  //   const data = new EditMeasureDataParams();
  //   data.id = this.pcmMOdelData.id;
  //   data.patientId = this.PatientId;
  //   data.code = this.selectedMeasure.code;
  //   data.lastDone = this.pcmMOdelData.lastDone;
  //   data.nextDue = this.pcmMOdelData.nextDue;
  //   data.result = this.pcmMOdelData.result;
  //   data.controlled = this.pcmMOdelData.controlled;
  //   data.note = this.pcmMOdelData.note;
  //   if (!this.pcmMOdelData.currentStatus) {
  //     this.pcmMOdelData.currentStatus = 0;
  //   }
  //   data.currentStatus = this.pcmMOdelData.currentStatus;
  //   this.editingPcmData = true;
  //   this.subs.sink = this.pcmService.AddEditMeasureData(data).subscribe(
  //     (res: any) => {
  //       this.editingPcmData = false;
  //       this.GetPatientsMeasuresSummary();
  //       this.toaster.success('Data updated successfully');
  //         model.hide();
  //     },
  //     (err: HttpResError) => {
  //       this.editingPcmData = false;
  //       this.toaster.error(err.error, err.message);
  //     }
  //   );
  // }
  // AddScreening() {
  //   if (this.selectedMeasure.code === 'AM') {
  //     this.AddAMScreening();
  //   } else if (this.selectedMeasure.code === 'DP') {
  //     this.AddDepressionScreening();
  //   }
  // }
  // AddCounselling() {
  //   if (this.selectedMeasure.code === 'AM') {
  //     this.AddAlcoholCounselling();
  //   } else if (this.selectedMeasure.code === 'DP') {
  //     this.AddDepressionCounselling();
  //   }
  // }
  // AddAWEncounter() {
  //   this.isCreatingAWEncounter = true;
  //   this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
  //     this.isCreatingAWEncounter = false;
  //     this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingAWEncounter = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddDepressionCounselling() {
  //   this.isCreatingCounselling = true;
  //   this.pcmService.AddDepressionCounseling(this.PatientId).subscribe((res: any) => {
  //     this.isCreatingCounselling = false;
  //     this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingCounselling = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddAlcoholCounselling() {
  //   this.isCreatingCounselling = true;
  //   this.pcmService.AddAMCounseling(this.PatientId).subscribe((res: any) => {
  //     this.isCreatingCounselling = false;
  //     this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingCounselling = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddDepressionScreening() {
  //   this.isCreatingScreening = true;
  //   this.pcmService.AddDPScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
  //     this.isCreatingScreening = false;
  //     this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingScreening = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // AddAMScreening() {
  //   this.isCreatingScreening = true;
  //   this.pcmService.AddAMScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
  //     this.isCreatingScreening = false;
  //     this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${res.id}`);
  //   },
  //   (err: HttpResError) => {
  //     this.isCreatingScreening = false;
  //     this.toaster.error(err.error, err.message);
  //   });
  // }
  // onUploadOutput(output: any): void {
  //   if (output.target.files[0].size > 26214400) {
  //     this.toaster.warning('file size is more than 25 MB');
  //     return;
  //   }
  //   this.uploadImg = true;
  //   this.addPcDocument(output.target.files[0]);
  //   // if (output.target.files.length >= 1) {
  //   //   if (this.files.length > 0) {
  //   //     this.files.forEach(file => {
  //   //       if (file.name === output.target.files[0].name) return;
  //   //     });
  //   //   }
  //   //   this.files = [...this.files, ...output.target.files[0]];

  //   //   // this.imageFileExtension = false;
  //   // }
  // }

  scrollLeft() {
    this.listItems.nativeElement.firstChild.scrollLeft -= 150;
  }

  scrollRight() {
    this.listItems.nativeElement.firstChild.scrollLeft += 150;
  }
  valueChanged(event){
    this.encounterTimeForm.get('note').setValue(event);
  }
}
