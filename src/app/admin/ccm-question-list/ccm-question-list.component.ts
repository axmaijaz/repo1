import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import {
  CcmEncounterForList,
  CcmEncounterListDto
} from 'src/app/model/admin/ccm.model';
import * as moment from 'moment';
import { ProviderDto } from 'src/app/model/Provider/provider.model';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { UserManagerService } from 'src/app/core/UserManager/user-manager.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { CcmServiceType } from 'src/app/model/Questionnaire/Questionnire.model';
import { Location } from '@angular/common';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AppDataService } from 'src/app/core/app-data.service';
import { takeWhile } from 'rxjs/operators';
import { SubSink } from 'src/app/SubSink';
@Component({
  selector: "app-ccm-question-list",
  templateUrl: "./ccm-question-list.component.html",
  providers: [DatePipe],
  styleUrls: ["./ccm-question-list.component.scss"]
})
export class CcmQuestionListComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("timerInput") TimerInput: ElementRef;
  @ViewChild("durationInput") durationInput: ElementRef;
  @ViewChild("timerInput1") TimerInput1: ElementRef;
  @ViewChild("startTimerModal") startTimerModal: ModalDirective;
  @ViewChild("tabCloseModal") tabCloseModal: ModalDirective;
  disableCounterTime = true;
  private subs = new SubSink();
  notesRowSize = 3;
  providerList = new Array<ProviderDto>();
  serviceTypes = new Array<CcmServiceType>();
  ccmEncounterList: CcmEncounterForList;
  PatientId: number;
  loading = false;
  consentDate: string;
  followUpDate: string;
  inputActionType = 0;
  currentMonth: number = new Date().getMonth() + 1;
  encounterTimeForm: FormGroup;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "hh:mm"
  };
  public displayDate;
  seleteddate = new Date();

  // for timer properties
  timer = 0;
  firstimeTimerStart = true;
  timerStart = false;
  divide = 1000;
  myInterval = -1;
  seconds = 0;
  minutes = 0;
  hours = 0;
  PatientData: any;
  PatientAge: number;
  questionaireList: any;
  facilityId: number;
  stopCounterOnDuration = true;
  yearNum: number;
  listOfYears = [];
  showStartTimeMOdal = true;
  showAlertFEncounter: boolean;
  addingEncounter: boolean;
  public dropdownScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside"
  };
  private alive = true;
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHander(event) {
    if (this.timerStart || this.encounterTimeForm.get("endTime").value) {
      return false;
    } else {
      return true;
    }
  }
  constructor(
    private route: ActivatedRoute,
    private patientsService: PatientsService,
    private facilityService: FacilityService,
    private ccmService: CcmDataService,
    private securityService: SecurityService,
    private questionService: QuestionnaireService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private toaster: ToastService,
    private userManagerService: UserManagerService,
    private appDataService: AppDataService,
    private location: Location,
    private router: Router
  ) {
    this.disableCounterTime = true;
  }

  ngOnInit() {
    this.yearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    this.encounterTimeForm = this.fb.group({
      id: 0,
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      encounterDate: [
        this.datePipe.transform(new Date(), "yyyy-MM-dd"),
        Validators.required
      ],
      note: [""],
      ccmServiceTypeId: [null, Validators.required],
      patientId: this.PatientId,
      appAdminId: 1,
      careProviderId: [null, Validators.required],
      careProviderName: ""
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
        this.serviceTypes = res;
      },
      err => {
        // console.log(err);
      }
    );
    // this.questionService
    //   .getPatientTemplate(this.PatientId)
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.questionaireList = res;
    //       if (res.id > 0 && res.carePlanQuestionnaires.length > 0) {
    //         this.startTimerModal.show();
    //       }
    //     }
    //   });
    this.subs.sink = this.appDataService.patientDataChanged
      .asObservable()
      .pipe(takeWhile(() => this.alive))
      .subscribe((res: boolean) => {
        if (this.appDataService.patientTemplate) {
          this.questionaireList = this.appDataService.patientTemplate;
          if (
            this.showStartTimeMOdal &&
            this.questionaireList.id > 0 &&
            this.questionaireList.carePlanQuestionnaires.length > 0
          ) {
            this.startTimerModal.show();
            this.showStartTimeMOdal = false;
          }
        }
      });
    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
    this.loadProviders();
    this.gertPatientData();

  }

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    this.alive = false;
    this.startTimerModal.hide();
    this.subs.unsubscribe();
  }
  gertPatientData() {
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.PatientData = res;
              this.PatientAge = this.calculateAge(this.PatientData.dateOfBirth);
              // this.disableCounterTime = false;
            }
          },
          error => {
            // console.log(error);
          }
        );
    }
  }
  public calculateAge(birthdate: any): number {
    return moment().diff(birthdate, "years");
  }
  loadProviders() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.subs.sink = this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.providerList = res;
            this.encounterTimeForm
              .get("careProviderId")
              .setValue(this.securityService.securityObject.id);
          }
        },
        error => {
          // console.log(error);
        }
      );
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
  }

  SubmitEncounterTimeForm() {
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
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService.addCCMEncounter(a).subscribe(
      (res: CcmEncounterListDto) => {
        this.loading = false;
        this.addingEncounter = false;
        this.encounterTimeForm.get("startTime").setValue("");
        this.encounterTimeForm.get("endTime").setValue("");
        this.encounterTimeForm.get("note").setValue("");
        this.encounterTimeForm.get("ccmServiceTypeId").setValue(null);
        this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
        // this.ccmEncounterList.ccmEncountersList.unshift(res);
      },
      err => {
        this.encounterTimeForm.get("startTime").setValue("");
        this.encounterTimeForm.get("endTime").setValue("");
        this.encounterTimeForm.get("note").setValue("");
        this.toaster.error(err.message, err.error || err.error);
        this.loading = false;
        this.addingEncounter = false;
      }
    );
  }
  validaeTimeDifference(a): boolean {
    const sTime = moment(a.startTime, "HH:mm");
    const eTime = moment(a.endTime, "HH:mm");
    const res = sTime.isBefore(eTime);
    return res;
  }

  searchLogsByMonth() {
    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
  }

  getLogsByPatientAndMonthId(patientId, monthId) {
    if (patientId && monthId) {
      this.subs.sink = this.ccmService
        .getCCMEncounterByPatientId(patientId, monthId, this.yearNum)
        .subscribe(
          res => {
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
          err => {}
        );
    }
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
    }, 1000);
    this.timerStart = true;
  }
  pauseTimer() {
    clearInterval(this.myInterval);
    this.myInterval = -1;
    this.timerStart = false;
  }
  stopTimer() {
    this.pauseTimer();
    const startTime = this.encounterTimeForm.get("startTime").value;
    const splitedTime = startTime.split(":");
    // tslint:disable-next-line:radix
    const second = parseInt(splitedTime[2]);
    // tslint:disable-next-line:radix
    const minute = parseInt(splitedTime[1]);
    // tslint:disable-next-line:radix
    const hour = parseInt(splitedTime[0]);
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
  updateFollowUpDate(date: any) {
    const obj = {
      patientId: this.PatientId,
      followUpDate: date
    };
    this.subs.sink = this.ccmService.changefollowUpDate(obj).subscribe(
      res => {
        this.toaster.success("Data Updated Successfully");
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  updateConsentDate(date: any) {
    const obj = {
      patientId: this.PatientId,
      consentDate: date
    };
    this.subs.sink = this.ccmService.changeConsentDate(obj).subscribe(
      res => {
        this.toaster.success("Data Updated Successfully");
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  navigateBack() {
    this.location.back();
  }

  watchSectionionTimeLog(action: number) {
    // 1: start , 2: stop , 0: pause
    if (action === 0) {
      this.inputActionType = 0;
    } else if (action === 1) {
      this.inputActionType = 1;
    } else if (action === 2) {
      this.inputActionType = 2;
    }
  }

  restrictNavigation() {
    if (
      (this.timerStart || this.encounterTimeForm.get("endTime").value) &&
      this.questionaireList &&
      this.questionaireList.id > 0 &&
      this.questionaireList.carePlanQuestionnaires.length > 0
    ) {
      this.tabCloseModal.show();
    } else {
      // this.navigateBack();
      this.router.navigateByUrl("/admin/patient/" + this.PatientId + "/summary");
    }
  }
}
