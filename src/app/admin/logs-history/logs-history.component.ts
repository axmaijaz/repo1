import { ToastService, TabsetComponent, ModalDirective } from "ng-uikit-pro-standard";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { CcmEncounterForList, CcmEncounterListDto, CCMValidityStatusDto } from "src/app/model/admin/ccm.model";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { DatePipe, Location } from "@angular/common";
import { RPMEncounterDto } from "src/app/model/rpm.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { RpmService } from "src/app/core/rpm.service";
import { AppDataService } from "src/app/core/app-data.service";
import * as FileSaver from 'file-saver';
import { SubSink } from 'src/app/SubSink';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import moment from "moment";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { FacilityService } from "src/app/core/facility/facility.service";
import { ProviderDto } from "src/app/model/Provider/provider.model";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { CcmServiceType } from "src/app/model/Questionnaire/Questionnire.model";
import { RPMServiceType } from "src/app/Enums/rpm.enum";

@Component({
  selector: "app-logs-history",
  templateUrl: "./logs-history.component.html",
  providers: [DatePipe],
  styleUrls: ["./logs-history.component.scss"]
})
export class LogsHistoryComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("editRpmEncounterModal") editRpmEncounterModal: ModalDirective;

  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'hh:mm'
  };
  public datePickerRpmConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A'
  };
  private subs = new SubSink();
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  ShowTab: boolean;
  ccmEncounterList: CcmEncounterForList;
  consentDate: string;
  followUpDate: string;
  patientId: number;
  // monthId: number = new Date().getMonth() + 1;
  monthId: number;
  // currentYear: number = new Date().getFullYear();
  yearNum: number;
  listOfYears = [];
  rpmMonthId: number = new Date().getMonth() + 1;
  rpmEncounterList = new Array<RPMEncounterDto>();
  public scrollbarOptions = { axis: "y", theme: "minimal-dark" };
  isLoading: boolean;
  rpmEncounterDto = new RPMEncounterDto();
  public dropdownScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside"
  };
  filters: string;

  encounterTimeForm: FormGroup;
  addingEncounter: boolean;
  showValidationAlert: string;
  // @ViewChild('timerInput') TimerInput: ElementRef;
  @ViewChild('durationInput') durationInput: ElementRef;
  @ViewChild('timerInput1') TimerInput1: ElementRef;
  @ViewChild('addCCMEncounterModal') addCCMEncounterModal: ModalDirective;
  loading: boolean;
  showAlertFEncounter: boolean;
  timerStart = false;
  firstimeTimerStart = true;
  myInterval = -1;
  seconds = 0;
  minutes = 0;
  hours = 0;
  stopCounterOnDuration = true;
  providerList = new Array<ProviderDto>();
  facilityId: number;
  serviceTypes = new Array<CcmServiceType>();
  isLoadingTypes: boolean;
  gettingEncounterLogs: boolean;
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  viewType: string;
  isIframe: boolean;
  rpmServiceTypeEnum = RPMServiceType;
  addingRPMEncounter: boolean;
  CanModifyCCMEncounter = false;
  CanModifyRPMEncounter = false;
  loadingRPMEncounter: boolean;
  isMainView: string;
  isEditCCMMode: boolean;
  includeRpmLogs= false;
  includeCcmLogs= false;


  // currentMonth: number = new Date().getMonth() + 1;
  constructor(
    private ccmService: CcmDataService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public location: Location,
    private rpmService: RpmService,
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private questionService: QuestionnaireService,
    private fb: FormBuilder,
    private appUi: AppUiService,
    private toaster: ToastService,
    private appData: AppDataService
  ) {}
  ngOnInit() {
    // this.yearNum = this.appData.currentYear;
    this.listOfYears = this.appData.listOfYears;
    this.patientId = +this.route.snapshot.paramMap.get("id");
    this.encounterTimeForm = this.fb.group({
      id: 0,
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      encounterDate: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required
      ],
      note: [''],
      ccmServiceTypeId: [null, Validators.required],
      patientId: this.patientId,
      appAdminId: 1,
      careProviderId: [null, Validators.required],
      careProviderName: ''
    });
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    } else {
      this.facilityId = 0;
    }
    this.subs.sink = this.questionService.getServiceTypeList(false).subscribe(
      (res: any) => {
        // this.startTimerModal.show();
        // this.disableCounterTime = false;
        // this.startTimer();
        this.serviceTypes = res;
        this.serviceTypes.forEach(element => {
          if (element.name === 'Monthly Clinical Review') {
            this.encounterTimeForm.get('ccmServiceTypeId').setValue(element.id);
          }
        });
      },
      err => {
        // console.log(err);
      }
    );
    this.isIframe = this.route.snapshot.queryParamMap.get('isIframe') ? true : false;
    this.isMainView = this.route.snapshot.queryParamMap.get('viewType');
    this.viewType = this.route.snapshot.queryParamMap.get('viewType') || 'CCM';
    if(this.viewType == 'CCM'){
      this.includeCcmLogs = true;
    }
    if(this.viewType == 'RPM'){
      this.includeRpmLogs = true;
    }
    this.getLogsByPatientAndMonthId(this.patientId, this.monthId);
    this.getLogsByPatientAndMonthIdRPM();
    this.loadProviders();
    this.filters = this.route.snapshot.queryParamMap.get('rpm');
    if(this.securityService.hasClaim('CanModifyRPMEncounter')){
      this.CanModifyRPMEncounter = true;
    }
    if(this.securityService.hasClaim('CanModifyCCMEncounter')){
      this.CanModifyCCMEncounter = true;
    }
  }
  ngAfterViewInit() {
    if (this.filters || this.viewType === 'RPM') {
      if (this.staticTabs.tabs[2]) {
        this.staticTabs.setActiveTab(2);
      }
      this.viewType = 'RPM';
    }
    if (this.viewType === 'CCM') {
      if (this.staticTabs.tabs[1]) {
        this.staticTabs.setActiveTab(1);
      }
      this.viewType = 'CCM';
    }
    if (this.viewType === 'BHI') {
      if (this.staticTabs.tabs[3]) {
        this.staticTabs.setActiveTab(3);
      }
      this.viewType = 'BHI';
    }
    if(this.viewType == 'CCM'){
      this.includeCcmLogs = true;
    }
    if(this.viewType == 'RPM'){
      this.includeRpmLogs = true;
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
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
              .get('careProviderId')
              .setValue(this.securityService.securityObject.id);
          }
        },
        error => {
          // console.log(error);
        }
      );
  }
  sumEncounterstime(): number {
    const editEncounterId = this.encounterTimeForm.get('id').value;
    let totalTime = 0;
    this.ccmEncounterList.ccmEncountersList.forEach(item => {
      if (!editEncounterId || (editEncounterId !== item.id)) {
        const startTime = moment(item.startTime, 'HH:mm');
        const endTime = moment(item.endTime, 'HH:mm');
        const calculateDuration = moment.duration(endTime.diff(startTime));
        const timeMInutes = calculateDuration.hours() * 60 + calculateDuration.minutes();
        totalTime = timeMInutes + totalTime;
      }
    });
    const dura = +this.durationInput.nativeElement.value;
    if (dura) {
      totalTime = totalTime + dura;
    }
    return totalTime;
  }
  GetCcmMSValidityInfo() {
    this.addingEncounter = true;
    this.subs.sink = this.ccmService.GetCcmMSValidityInfo(this.patientId).subscribe(
      (res: CCMValidityStatusDto) => {
        this.showValidationAlert = `
        <div>
          <div class="d-flex justify-content-center">
            <h4 class="text-center">Do you Want to submit ?</h4>
          </div>
          <div class="d-flex justify-content-between">
            <p><strong>Time</strong></p>
            <div>
              <strong class="ml-3">${this.sumEncounterstime()}</strong>
              <span ${this.sumEncounterstime() > 19 ? 'class="text-primary"' : 'class="text-danger"'}>${this.sumEncounterstime() > 19 ? 'Meet' : 'Not Meet'}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <p><strong>Assessment</strong></p>
            <div>
              <strong class="ml-3">${res.assessedQuestions}</strong>
              <span ${res.assessedQuestions > 3 ? 'class="text-primary"' : 'class="text-danger"'}>${res.assessedQuestions > 3 ? 'Meet' : 'Not Meet'}</span>
            </div>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <p><strong>Active Interventions</strong></p>
            <div>
              <strong class="ml-3">${res.activeInterventions}</strong>
              <span ${res.activeInterventions > 0 ? 'class="text-primary"' : 'class="text-danger"'}>${res.activeInterventions > 0 ? 'Meet' : 'Not Meet'}</span>
            </div>
            </div>
          </div>
          <div class="d-flex justify-content-between alert alert-warning alert-dismissible animated fade show" role="alert">
            <strong>Best Practices are not included</strong>
          </div>
        </div>`;
        // this.showValidationAlert = `Time: ${this.sumEncounterstime()} , Assessed: ${res.assessedQuestions}, Active Interventions: ${res.activeInterventions} `;
        // this.showValidationAlert += '\n Do you want to submit ?';
        this.showAlertMessage();
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
    modalDto.Title = 'Alert';
    modalDto.Text = this.showValidationAlert;
    // modalDto.hideProceed = true;
    modalDto.callBack = this.SubmitEncounterTimeForm;
    modalDto.data = {};
    this.appUi.openLazyConfrimModal(modalDto);
  }
  durationChanged(minsToAdd: number) {
    const startTime = this.encounterTimeForm.get('startTime').value;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece = startTime.split(':');
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    this.encounterTimeForm.get('endTime').setValue(newTime);
  }
  SubmitEncounterTimeForm = () => {
    this.showValidationAlert = '';
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
      a['isMonthlyStatusValid'] = true;
    }
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService.addCCMEncounter(a).subscribe(
      (res: CcmEncounterListDto) => {
        this.loading = false;
        this.addingEncounter = false;
        this.encounterTimeForm.get('startTime').setValue('');
        this.encounterTimeForm.get('endTime').setValue('');
        this.encounterTimeForm.get('note').setValue('');
        this.encounterTimeForm.get('ccmServiceTypeId').setValue(null);
        this.resetFields();
        this.getLogsByPatientAndMonthId(this.patientId, this.monthId);
        // this.ccmEncounterList.ccmEncountersList.unshift(res);
      },
      error => {
        this.encounterTimeForm.get('startTime').setValue('');
        this.encounterTimeForm.get('endTime').setValue('');
        this.encounterTimeForm.get('note').setValue('');
        this.toaster.error(error.message, error.error || error.error);
        this.loading = false;
        this.addingEncounter = false;
      }
    );
  }
  getTimerTime(seconds, minutes, hours): string {
    let times = '';
    if (hours < 10) {
      times += '0' + hours;
    } else {
      times += hours;
    }
    times += ':';
    if (minutes < 10) {
      times += '0' + minutes;
    } else {
      times += minutes;
    }
    times += ':';
    if (seconds < 10) {
      times += '0' + seconds;
    } else {
      times += seconds;
    }

    return times;
  }
  startTimer() {
    this.durationInput.nativeElement.value = null;
    if (this.firstimeTimerStart) {
      const date = moment().format('hh:mm');
      this.encounterTimeForm.get('startTime').setValue(date);
      this.encounterTimeForm.get('endTime').setValue('');
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
      // this.TimerInput.nativeElement.value = this.getTimerTime(
      //   this.seconds,
      //   this.minutes,
      //   this.hours
      // );
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
    const startTime = this.encounterTimeForm.get('startTime').value;
    const splitedTime = startTime.split(':');
    // tslint:disable-next-line:radix
    const second = parseInt(splitedTime[2]);
    // tslint:disable-next-line:radix
    const minute = parseInt(splitedTime[1]);
    // tslint:disable-next-line:radix
    const hour = parseInt(splitedTime[0]);
    let EndTime = hour + this.hours + ':' + (minute + this.minutes);
    // + ':' +
    // (second + this.seconds);
    EndTime = moment(EndTime, 'h:m').format('hh:mm');
    this.encounterTimeForm.get('endTime').setValue(EndTime);
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    // this.TimerInput.nativeElement.value = '00:00:00';
    this.TimerInput1.nativeElement.value = '00:00:00';
    this.firstimeTimerStart = true;
    const pre = moment(startTime, 'hh:mm');
    const current = moment(EndTime, 'hh:mm');
    if (this.stopCounterOnDuration) {
      const result = moment.duration(current.diff(pre));
      this.durationInput.nativeElement.value =
        result.hours() * 60 + result.minutes();
    } else {
      this.stopCounterOnDuration = true;
    }
  }
  validaeTimeDifference(a): boolean {
    const sTime = moment(a.startTime, 'HH:mm');
    const eTime = moment(a.endTime, 'HH:mm');
    const res = sTime.isBefore(eTime);
    return res;
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
      a['isMonthlyStatusValid'] = true;
    }
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService.EditCcmEncounter(a).subscribe(
      (res: CcmEncounterListDto) => {
        this.loading = false;
        this.addingEncounter = false;
        this.addCCMEncounterModal.hide();
        this.toaster.success('Data updated successfully');
        // this.AddNew();
        // const index = this.ccmEncounterList.ccmEncountersList.findIndex(item => item.id === a.id);
        // this.ccmEncounterList.ccmEncountersList[index] = res;
        this.getLogsByPatientAndMonthId(this.patientId, this.monthId);
        // this.ccmEncounterList.ccmEncountersList.unshift(res);
      },
      (error: HttpResError) => {
        this.toaster.error(error['statusText'], error.error || error.message);
        this.loading = false;
        this.addingEncounter = false;
      }
    );
  }
  AddNew() {
    this.showValidationAlert = '';
    this.encounterTimeForm.get('id').setValue(0);
    const sdsd = moment().format('hh:mm');
    this.encounterTimeForm.get('startTime').setValue(sdsd);
    this.encounterTimeForm.get('endTime').setValue(null);
    const date = moment().format('YYYY-MM-DD');
    this.encounterTimeForm.get('encounterDate').setValue(date);
    // this.encounterTimeForm.get('careProviderId').setValue(null);
    this.encounterTimeForm.get('note').setValue(null);
    this.resetFields();
    // this.encounterTimeForm.get('appAdminId').setValue(1);
    this.encounterTimeForm.get('patientId').setValue(this.patientId);
    this.serviceTypes.forEach(element => {
      if (element.name === 'Monthly Clinical Review') {
        this.encounterTimeForm.get('ccmServiceTypeId').setValue(element.id);
      }
    });
    this.encounterTimeForm.get('careProviderName').setValue('');
    this.durationInput.nativeElement.value = 0;
  }


  getLogsByPatientAndMonthId(patientId, monthId) {
    this.gettingEncounterLogs = true;
    let monthSelected = 0;
    let yearNum = 0;
    if (monthId) {
      monthSelected = monthId;
    }
    if (this.yearNum) {
      yearNum = this.yearNum;
    }
    if (patientId) {
      this.subs.sink = this.ccmService
        .getCCMEncounterByPatientId(patientId, monthSelected, yearNum)
        .subscribe(
          res => {
            this.gettingEncounterLogs = false;
            this.ccmEncounterList = res;
            // this.consentDate = this.datePipe.transform(
            //   this.ccmEncounterList.consentDate,
            //   "mediumDate"
            // );
            // this.followUpDate = this.datePipe.transform(
            //   this.ccmEncounterList.followUpDate,
            //   "mediumDate"
            // );
          },
          err => {
            this.gettingEncounterLogs = false;
          }
        );
    }
  }
  SeteditEncounterValues(encounter: CcmEncounterListDto) {
    this.isEditCCMMode = true;
    this.addCCMEncounterModal.show();
    this.showValidationAlert = '';
    this.encounterTimeForm.get('id').setValue(encounter.id);
    this.encounterTimeForm.get('startTime').setValue(encounter.startTime);
    this.encounterTimeForm.get('endTime').setValue(encounter.endTime);
    const date = moment(encounter.encounterDate).format('YYYY-MM-DD');
    this.encounterTimeForm.get('encounterDate').setValue(date);
    this.encounterTimeForm.get('careProviderId').setValue(encounter.careProviderId);
    this.encounterTimeForm.get('note').setValue(encounter.note);
    this.encounterTimeForm.get('appAdminId').setValue(1);
    this.encounterTimeForm.get('patientId').setValue(this.patientId);
    this.encounterTimeForm.get('ccmServiceTypeId').setValue(encounter.ccmServiceTypeId);
    this.encounterTimeForm.get('careProviderName').setValue('');
    this.encounterTimeForm.get('startTime').setValue(encounter.startTime);
    const startTime = moment(encounter.startTime, 'HH:mm');
    const endTime = moment(encounter.endTime, 'HH:mm');
    const calculateDuration = moment.duration(endTime.diff(startTime));
    this.durationInput.nativeElement.value = calculateDuration.hours() * 60 + calculateDuration.minutes();
  }
  openConfirmModal(data: CcmEncounterListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Alert';
    modalDto.Text = 'Do you want to delete this encounter ?';
    // modalDto.hideProceed = true;
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (encounter: CcmEncounterListDto) => {
    this.gettingEncounterLogs = true;
    if (this.encounterTimeForm.get('id').value && this.encounterTimeForm.get('id').value === encounter.id) {
      this.AddNew();
    }
    this.ccmService.DeleteCcmEncounter(encounter.id).subscribe(res => {
      this.toaster.success('Encounter deleted successfully');
      // const index = this.ccmEncounterList.ccmEncountersList.findIndex(item => item.id === encounter.id);
      // this.ccmEncounterList.ccmEncountersList.splice(index , 1);

      this.getLogsByPatientAndMonthId(this.patientId, this.monthId);
      // this.gettingEncounterLogs = false;
    },
    (error: HttpResError) => {
      this.isLoadingTypes = false;
      this.toaster.error(error.error, error.message);
    });
  }

  getLogsByPatientAndMonthIdRPM() {
    let monthId = this.monthId;
    let yearNum = this.yearNum;
    if (!this.monthId) {
      monthId = 0;
    }
    if (!this.yearNum) {
      yearNum = 0;
    }
    if (this.patientId) {
      this.loadingRPMEncounter = true;
      this.subs.sink = this.rpmService
      .getRPMEncounters(this.patientId, monthId, yearNum)
      .subscribe(
        res => {
          this.rpmEncounterList = res;
          this.loadingRPMEncounter = false;
        },
        (error: HttpResError) => {
            this.loadingRPMEncounter = false;
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  goBack() {
    this.location.back();
  }
  DownLoadPDF() {
    this.isLoading = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const mWindow = window.open(nUrl);
    const patientId = this.patientId;
    let monthId = this.monthId;
    let yearNum = this.yearNum;
    if (!this.monthId) {
      monthId = 0;
    }
    if (!this.yearNum) {
      yearNum = 0;
    }
    this.includeRpmLogs = false;
    this.includeCcmLogs = false;
    if(this.viewType == 'CCM'){
      this.includeCcmLogs = true;
    }
    if(this.viewType == 'RPM'){
      this.includeRpmLogs = true;
    }
    const includeCarePlan = false;
    this.subs.sink = this.ccmService
      .GetLogsHistoryByPatientId(patientId, monthId, yearNum, includeCarePlan, this.includeRpmLogs, this.includeCcmLogs )
      .subscribe(
        (res: any) => {
          this.isLoading = false;

          const file = new Blob([res], { type: 'application/pdf' });
          const objectURL = window.URL.createObjectURL(file);

          mWindow.close();
          this.objectURLStrAW = objectURL;
          this.viewPdfModal.show();
          // mWindow.location.href = fileURL;

          // FileSaver.saveAs(
          //   new Blob([res], { type: "application/pdf" }),
          //   `${patientId}-${monthId}-${this.yearNum}-LogHistory.pdf`
          // );
        },
        (err: any) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  resetFields() {
    if (this.encounterTimeForm.get('note').invalid) {
      this.encounterTimeForm.get('note').reset();
    }
  }
  SeteditRpmEncounterValues(item){
    console.log(item);
    this.rpmEncounterDto.encounterDate = moment(item.encounterDate).format('YYYY-MM-DD hh:mm A');
    const startTime = moment(item.startTime, 'HH:mm');
    const endTime = moment(item.endTime, 'HH:mm');
    const calculateDuration = moment.duration(endTime.diff(startTime));
    this.rpmEncounterDto.duration = (calculateDuration.hours() * 60 + calculateDuration.minutes()).toString()
    this.rpmEncounterDto.rpmServiceType = item.rpmServiceType;
    this.rpmEncounterDto.note = item.note;
    this.rpmEncounterDto.id = item.id;
    this.editRpmEncounterModal.show();
  }
  editRpmEncounter(){
    if (this.patientId) {
      this.rpmEncounterDto.patientId = this.patientId;
      // if (this.securityService.hasClaim('RPMEncounterUserId')) {
      //   this.rpmEncounterDto.facilityUserId = +this.securityService.getClaim(
      //     'RPMEncounterUserId'
      //   ).claimValue;
      // } else {
      //   this.rpmEncounterDto.facilityUserId = this.securityService.securityObject.id;
      // }
      this.rpmEncounterDto.startTime = moment(
        this.rpmEncounterDto.encounterDate,
        'YYYY-MM-DD hh:mm A'
      ).format('hh:mm');
      this.durationChangedRpm(+this.rpmEncounterDto.duration);
      const hours = Math.floor(+this.rpmEncounterDto.duration / 60);
      const minutes = +this.rpmEncounterDto.duration % 60;
      this.rpmEncounterDto.duration = hours + ':' + minutes;
      if (hours > 0) {
        this.rpmEncounterDto.duration = moment(
          this.rpmEncounterDto.duration,
          'h:m'
        ).format('hh:mm');
      }
      this.addingRPMEncounter = true;
      this.rpmService.EditRPMEncounter(this.rpmEncounterDto).subscribe(
        res => {
          this.editRpmEncounterModal.hide();
          this.toaster.success('Rpm Encounter Edited Successfully');
          this.getLogsByPatientAndMonthIdRPM()
          this.addingRPMEncounter = false;
          this.rpmEncounterDto.id = 0;
          this.rpmEncounterDto.encounterDate = '';
          this.rpmEncounterDto.note = '';
          this.rpmEncounterDto.duration = '';
          this.rpmEncounterDto.startTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.rpmServiceType = null;
          this.rpmEncounterDto.isProviderRpm = false;
          // this.getRpmEncounterTime1();
          this.AddNew();
        },
        (error: HttpResError) => {
          this.addingRPMEncounter = false;
          this.toaster.error(error.message, error.error);
        }
      );
    }
  }
  durationChangedRpm(minsToAdd: number) {
    const startTime = this.rpmEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece = startTime.split(':');
    const mins = +piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    this.rpmEncounterDto.endTime = newTime;
  }
}
