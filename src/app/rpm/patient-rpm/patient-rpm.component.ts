import { IntellisenseService } from './../../core/Tools/intellisense.service';
import { SmartMeterService } from './../../core/smart-meter.service';
import { VerifyModalDto } from './../../model/AppModels/app.model';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { RPMEncounterDto, BPDeviceDataDto, BGDeviceDataDto, BloodPressure, DeletePatientDeviceDto, PatientHealthCareDeviceForListDto, WeightDataDto,
  PulseOximetryDataDto, ActivityDataDto, ModalityDto, RPMDeviceListDtoNew, AlertsNew, CareGapsReadingsForRPMDto, RPMCopyDto, SetupRPMDeviceResponseDto, SetupRPMDeviceParamsDto, PHDeviceDto, EditRpmReadingDto } from 'src/app/model/rpm.model';
import { RpmService } from 'src/app/core/rpm.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective, IMyOptions, MDBDatePickerComponent, CollapseComponent } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/core/security/security.service';
import * as moment from 'moment';
import { UserType } from 'src/app/Enums/UserType.enum';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { CreateFacilityUserDto, VerifyPhoneNumberDto, SendPhoneNoVerificationDto } from 'src/app/model/Facility/facility.model';
import { AppUserClaim } from 'src/app/model/security/app-user-claim';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { ClonerService } from 'src/app/core/cloner.service';
import { EmitEvent, EventTypes, EventBusService } from 'src/app/core/event-bus.service';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DeletPatientDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { AppDataService } from 'src/app/core/app-data.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import Chart from 'chart.js';
import { element } from 'protractor';
import { Modalities, RPMServiceType } from 'src/app/Enums/rpm.enum';
import { FormGroup } from '@angular/forms';
import { ValidateSMResponseDto } from 'src/app/model/smartMeter.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { translateXY } from '@swimlane/ngx-datatable';
import { SmartPhraseListDto } from 'src/app/model/Tools/intellisense.model';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';
import { PatientRpmModalitiesComponent } from './../../patient-shared/patient-rpm-modalities/patient-rpm-modalities.component';
import { RpmMonthlyStatus } from 'src/app/Enums/filterPatient.enum';
@Component({
  selector: 'app-patient-rpm',
  templateUrl: './patient-rpm.component.html',
  styleUrls: ['./patient-rpm.component.scss']
})
export class PatientRpmComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('verificationModal') verificationModal: ModalDirective;
  @ViewChild('datePicker') datePicker: MDBDatePickerComponent;
  @ViewChild('editor12') editor12: ElementRef;
  @ViewChild('tests') rpmCreateEncounterCollapse: CollapseComponent;
  @ViewChild('showGoalIntervention') showGoalIntervention: CollapseComponent;
  @ViewChild('treatmentPlan') treatmentPlan: CollapseComponent;
  @ViewChild('patientRPMCompRef') patientRPMCompRef: PatientRpmModalitiesComponent;
  @ViewChild("durationInput") durationInput: ElementRef;
  // mahmood
  @ViewChild ('editor123') editor123: ElementRef;

  @ViewChild("listItems", { read: ElementRef })
  public listItems: ElementRef<any>;
  // public datePickerConfig: IDatePickerConfig = {
  //   allowMultiSelect: false,
  //   returnedValueType: ECalendarValue.StringArr,
  //   format: "YYYY-MM-DD",
  //   appendTo: "body",
  // };
  // mahmood

  rpmEncounterList = new Array<RPMEncounterDto>();
  rpmEncounterDto = new RPMEncounterDto();
  editRpmReadingDto = new EditRpmReadingDto();
  patientId: number;
  monthId: number = new Date().getMonth() + 1;
  rpmMonthId: number = new Date().getMonth() + 1;
  yearNum: number = new Date().getFullYear();
  graphMonthId: number = new Date().getMonth() + 1;
  graphYearId: number = new Date().getFullYear();
  listOfYears = [];
  facilityId: number;
  rpmNotes= '';
  billingProviders = new Array<CreateFacilityUserDto>();
  selectedBillingProvider = new CreateFacilityUserDto();
  password = '';
  canAddEncounter = false;
  // devicesList = new Array<PatientHealthCareDeviceForListDto>();
  isLoading = false;
  ownDeviceModailtyName = '';
  notesRowSize = 3;

  patientData = new PatientDto();
  verifyPhoneNoDto = new VerifyPhoneNumberDto();
  sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
  verificationUserName: string;

  careGapsReadingsForRPMDto = new CareGapsReadingsForRPMDto();
  disableYear: number;
  disableMonth: number;
  disableDay: number;
  patientEncounterMonthlyStatusAcknowledge = false;
  PatientEncounterMonthlyStatus = RpmMonthlyStatus["Not Started"];
  PatientEncounterMonthlyStatusTExt = RpmMonthlyStatus[RpmMonthlyStatus["Not Started"]];
  rpmMonthlyStatusEnum = RpmMonthlyStatus;
  rpmMonthlyStatusEnumList = this.filterDataService.getEnumAsList(RpmMonthlyStatus);

  phDeviceDto = new Array<PHDeviceDto>();
  // public barChartPlugins = [pluginDataLabels];
  yearNow = new Date();
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: this.yearNow.getFullYear() + 5,
    dateFormat: 'yyyy-mm-dd',
    // closeAfterSelect: true,
  };

  public scrollbarOptions = { axis: 'xy', theme: 'dark-3', scrollInertia: 2, scrollButtons: { enable: true }, scrollbarPosition: 'outside'};
  public rpmScrollbarOptions = { axis: 'xy', theme: '', scrollInertia: 2, scrollButtons: { enable: true }, scrollbarPosition: 'outside'};
  public dropdownScroll = { axis: 'y', theme: 'dark-3', scrollInertia: 2, scrollButtons: { enable: true }, scrollbarPosition: 'outside'};
  public dropdownScrolls = { axis: 'y', theme: 'dark-3', scrollInertia: 1, scrollButtons: { enable: true }, scrollbarPosition: 'outside'};
  public chartType = 'horizontalBar';
 rpmencounterCovered = `CPT Code 99091 is the collection and interpretation of physiologic data (e.g., ECG, blood pressure, glucose monitoring) digitally stored and/or transmitted by the patient and/or caregiver to the physician or other qualified health care professional. In this instance, a QHP is qualified by education, training, licensure/regulation (when applicable). The code requires a minimum of 30 minutes of interpretation and review and is billable once in a 30-day billing period.`;


  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A',
    appendTo: "body",
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'mm'
  };
  verificationModalViewState = 0; // 0 for verify, 1 for edit
  newPhoneNo = '';
  updatingPhoneNo: boolean;
  verifyingPhone: boolean;
  sendingCode: boolean;
  providerName: string;
  addingRPMEncounter: boolean;
  gettingRPMCopyData: boolean;
  copyDataStr: string;
  selectedDeviceVendor = 'smartmeter';
  isModalityLogsLoading: boolean;
  rpmEncounterTime1: any = {};
  isEncounterDeleting: boolean;
  alreadyPendingBillingMsg: string;
  showValidationAlert: string;
  encounterTimeForm: FormGroup;
  hours: string;
  validatingDevice: boolean;
  selectedDate: string;
  selectedBpItem: any;
  rpmCarePlan: string;
  savingRPMCareplan: boolean;
  gettingPhrases: boolean;
  smartPhrasesList: SmartPhraseListDto[] = [];
  SelectedSmartPhrase = new SmartPhraseListDto();
  usingSMartPhrase: boolean;
  intellisensePreserveDetails: { typedElement: HTMLElement; wSelection: Selection; editor: any };
  editorClickListener: boolean;
  isLoadingRpmModalityStatistics: boolean;
  stopWatchInterval: NodeJS.Timeout;
  showValidationAlertData: string;
  isIframe: boolean;
  totalRpmDuration: any;
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

  stopWatchValue = 0;

  @ViewChild('myFIeldRefRPM') myFIeldRefRPM: TwoCTextAreaComponent;
  @ViewChild('myFIeldRefRPMNotes') myFIeldRefRPMNotes: TwoCTextAreaComponent;
  constructor(
    private location: Location,
    private rpmService: RpmService,
    private toaster: ToastService,
    private router: Router,
    private securityService: SecurityService,
    private facilityService: FacilityService,
    private cloneService: ClonerService,
    private route: ActivatedRoute,
    private ccmService: CcmDataService,
    private eventBus: EventBusService,
    private appDataService: AppDataService,
    private smartMeter: SmartMeterService,
    private appUi: AppUiService,
    private intellisenseService: IntellisenseService,
    private filterDataService: DataFilterService,
    private patientsService: PatientsService,
    private clipboard: Clipboard,
  ) {
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.rpmCreateEncounterCollapse.show();
      // this.patientRPMCompRef.LoadPatientRPMData(this.patientId)
    }, 400);

  }
  ngOnInit() {
    //  this.rpmEncounterDto.encounterDate = moment().format( 'YYYY-MM-DD hh:mm A');
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false ;
    this.yearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    this.patientId = +this.route.snapshot.paramMap.get('id');
    if (!this.patientId) {
      this.patientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    }
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.getBillingProviders();
    } else {
      this.facilityId = 0;
    }
    if (this.securityService.hasClaim('IsBillingProvider')) {
      // this.isBillingProvider = true;
      this.rpmEncounterDto.billingProviderId = this.securityService.securityObject.id;
      this.providerName = this.securityService.securityObject.fullName;
    }
    this.getPatientDetail();
    this.canAddEncounter = this.securityService.hasClaim('CanModifyRPMEncounter');
    this.getLogsByPatientAndMonthId();
    this.GetModalityLogsByPatientId();
    this.getRpmEncounterTime1();
    // this.getCcmMonthlyStatusArray();
    // this.getDevicesByPatientId();
    // this.getRpmEncounterTime();
    this.GetRPMCarePlan();
    this.AddNew();
    this.GetSmartPhrases();
    this.startStopWatch();
    this.isIframe = this.route.snapshot.queryParamMap.get('isIframe') ? true : false;
  }

  ngOnDestroy(): void {
    this.ResetStopWatch();
  }
  collapse(){
    this.showGoalIntervention.toggle()
  }
  collapseTreatmentPlan(){
    this.treatmentPlan.toggle();
  }
  startStopWatch() {
    this.stopWatchValue = 0;
    this.stopWatchInterval  = setInterval(() => {
      ++this.stopWatchValue;
      const result = moment().startOf('day').seconds(this.stopWatchValue).format('HH:mm:ss');
      document.getElementById('stopwatchFieldRPM1').setAttribute('value',result);
    }, 1000);
  }
  ResetStopWatch() {
    this.rpmEncounterDto.duration =  moment().startOf('day').seconds(this.stopWatchValue).minutes().toString();
    if ((this.stopWatchValue % 60) > 0) {
      this.rpmEncounterDto.duration = (+this.rpmEncounterDto.duration + 1).toString();
    }
    if (!+this.rpmEncounterDto.duration) {
      this.rpmEncounterDto.duration = null;
    }
    clearInterval(this.stopWatchInterval);
    this.stopWatchInterval = null;
    document.getElementById('stopwatchFieldRPM1')?.setAttribute('value','');
  }
  navigateBack() {
    this.location.back();
  }
  scrollTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }
  addRpmEncounter() {
    if (this.patientId) {
      this.rpmEncounterDto.patientId = this.patientId;
      if (this.securityService.hasClaim('RPMEncounterUserId')) {
        this.rpmEncounterDto.facilityUserId = +this.securityService.getClaim(
          'RPMEncounterUserId'
        ).claimValue;
      } else {
        this.rpmEncounterDto.facilityUserId = this.securityService.securityObject.id;
      }
      this.rpmEncounterDto.startTime = moment(
        this.rpmEncounterDto.encounterDate,
        'YYYY-MM-DD hh:mm A'
      ).format('hh:mm');
      this.durationChanged(+this.rpmEncounterDto.duration);
      const hours = Math.floor(+this.rpmEncounterDto.duration / 60);
      const minutes = +this.rpmEncounterDto.duration % 60;
      this.rpmEncounterDto.duration = hours + ':' + minutes;
      if (hours > 0) {
        this.rpmEncounterDto.duration = moment(
          this.rpmEncounterDto.duration,
          'h:m'
        ).format('hh:mm');
      }
      console.log('service type', this.rpmEncounterDto.rpmServiceType)
      this.addingRPMEncounter = true;
      this.rpmService.addRPMEncounter(this.rpmEncounterDto).subscribe(
        res => {
          this.getLogsByPatientAndMonthId();
          this.rpmEncounterDto.encounterDate = '';
          this.rpmEncounterDto.note = '';
          this.rpmEncounterDto.duration = '';
          this.rpmEncounterDto.startTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.rpmServiceType = null;
          this.rpmEncounterDto.isProviderRpm = false;
          // this.rpmEncounterList = res;
          this.toaster.success('Rpm Encounter Added Successfully');
          this.addingRPMEncounter = false;
          this.getRpmEncounterTime1();
          this.AddNew();
        },
        (error: HttpResError) => {
          this.addingRPMEncounter = false;
          this.toaster.error(error.message, error.error);
        }
      );
    }
  }
  EditRpmEncounter() {
    if (this.patientId) {
      this.rpmEncounterDto.patientId = this.patientId;
      if (this.securityService.hasClaim('RPMEncounterUserId')) {
        this.rpmEncounterDto.facilityUserId = +this.securityService.getClaim(
          'RPMEncounterUserId'
        ).claimValue;
      } else {
        this.rpmEncounterDto.facilityUserId = this.securityService.securityObject.id;
      }
      this.rpmEncounterDto.startTime = moment(
        this.rpmEncounterDto.encounterDate,
        'YYYY-MM-DD hh:mm A'
      ).format('hh:mm');
      this.durationChanged(+this.rpmEncounterDto.duration);
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
          this.getLogsByPatientAndMonthId();
          this.rpmEncounterDto.id = 0;
          this.rpmEncounterDto.encounterDate = '';
          this.rpmEncounterDto.note = '';
          this.rpmEncounterDto.duration = '';
          this.rpmEncounterDto.startTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.endTime = '';
          this.rpmEncounterDto.rpmServiceType = null;
          this.rpmEncounterDto.isProviderRpm = false;
          // this.rpmEncounterList = res;
          this.toaster.success('Rpm Encounter Edited Successfully');
          this.addingRPMEncounter = false;
          this.getRpmEncounterTime1();
          this.AddNew();
        },
        (error: HttpResError) => {
          this.addingRPMEncounter = false;
          this.toaster.error(error.message, error.error);
        }
      );
    }
  }
  GetRPMCarePlan() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.rpmService.GetRpmCarePlan(this.patientId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmCarePlan = res.carePlan ;
          }
        },
        (error: HttpResError) => {
          // this.loadingPsy = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  EditRPMCarePLan() {
    this.savingRPMCareplan = true;
    const data = {
      patientId: this.patientId,
      RPMCarePlan: this.rpmCarePlan
    };
    this.rpmService.EditRpmCarePlan(data).subscribe(
      (res) => {
      //  this.psyfacilityUserList = res;
        this.savingRPMCareplan = false;
      },
      (error: HttpResError) => {
        this.savingRPMCareplan = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  copyCarePlan() {
    let mydoc = document;
   const div = mydoc.createElement('div');
   // div.style.display = 'none';
   // const data: string = text;
   div.innerHTML = this.rpmCarePlan;
   mydoc.body.appendChild(div);
   const text = div.innerText;
   div.remove();
   this.clipboard.copy(text.toString());
   this.toaster.success('Content Copied');
 }
  SeteditEncounterValues(encounter: RPMEncounterDto) {
    this.showValidationAlert = '';
    this.rpmEncounterDto.id = encounter.id;
    const date = moment(encounter.encounterDate).format('YYYY-MM-DD hh:mm A');
    this.rpmEncounterDto.encounterDate = date;
    this.rpmEncounterDto.note = encounter.note;
    const startTime = moment(encounter.startTime, 'HH:mm');
    const endTime = moment(encounter.endTime, 'HH:mm');
    const calculateDuration = moment.duration(endTime.diff(startTime));
    this.rpmEncounterDto.duration = (calculateDuration.hours() * 60 + calculateDuration.minutes()).toString()
    this.rpmEncounterDto.rpmServiceType = encounter.rpmServiceType;
    this.FillNoteText(encounter.note);
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
  onRpmNoteText(data: string){
  const result = this.rpmNotes + '\n' +data
  this.rpmNotes = this.rpmNotes + '\n' + data
    this.FillRpmNoteText(result)
  }

  FillRpmNoteText(text: string) {
    if (this.myFIeldRefRPMNotes?.FillValue) {
      this.myFIeldRefRPMNotes.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRefRPMNotes?.FillValue) {
          this.myFIeldRefRPMNotes.FillValue(text);
        }
      }, 1000);
    }
  }
  AddNew() {
    this.showValidationAlert = '';
    this.rpmEncounterDto.id = 0;
    this.rpmEncounterDto.encounterDate = moment().format('YYYY-MM-DD hh:mm A');
    this.rpmEncounterDto.note = '';
    this.rpmEncounterDto.duration = '';
    this.rpmEncounterDto.rpmServiceType = 0 ;
    this.FillNoteText(this.rpmEncounterDto.note)
  }
  // getCcmMonthlyStatusArray() {
  //   const keys = Object.keys(Modalities).filter(
  //     (k) => typeof Modalities[k as any] === 'string'
  //   ); // ["A", "B"]
  //   const values = keys.map((key) => ({
  //     ModalityName: Modalities[key as any],
  //     ModalityCode: key,
  //   })); // [0, 1]
  //   this.rpmModalitEnumList = values;
  //   return values;
  // }
  GetModalityLogsByPatientId() {
    this.isModalityLogsLoading = true;
    if (this.patientId && this.rpmMonthId && this.yearNum) {
      this.rpmService
      .GetModalityLogsByPatientId(this.patientId, this.rpmMonthId, this.yearNum)
      .subscribe(
        (res: PHDeviceDto[]) => {
            this.isModalityLogsLoading = false;
            this.phDeviceDto = res;
          },
          (error: HttpResError) => {
            this.isModalityLogsLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  getLogsByPatientAndMonthId() {
    if (this.patientId && this.rpmMonthId) {
      this.rpmService
        .getRPMEncounters(this.patientId, this.rpmMonthId, this.yearNum)
        .subscribe(
          res => {
            this.rpmEncounterList = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  durationChanged(minsToAdd: number) {
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
  getBillingProviders() {
    if (this.facilityId) {
      this.facilityService
        .getBillingProvidersByFacilityId(this.facilityId)
        .subscribe(
          res => {
            this.billingProviders = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  validateUser() {
    this.rpmService
      .validateUser(this.selectedBillingProvider.userId, this.password)
      .subscribe(
        (res: boolean) => {
          this.password = '';
          this.selectedBillingProvider = new CreateFacilityUserDto();
          if (res) {
            this.canAddEncounter = res;
            let curentUser = new AppUserAuth();
            // Object.assign(curentUser, this.securityService.securityObject);
            curentUser = this.cloneService.deepClone<AppUserAuth>(
              this.securityService.securityObject
            );
            if (!this.securityService.hasClaim('CanModifyRPMEncounter')) {
              const claim = new AppUserClaim();
              claim.claimType = 'CanModifyRPMEncounter';
              claim.claimValue = 'true';
              curentUser.claims.push(claim);
            }
            if (!this.securityService.getClaim('RPMEncounterUserId')) {
              const claim = new AppUserClaim();
              claim.claimType = 'RPMEncounterUserId';
              claim.claimValue = this.selectedBillingProvider.id.toString();
              curentUser.claims.push(claim);
            } else {
              this.securityService.updateClaim(
                'RPMEncounterUserId',
                this.selectedBillingProvider.id.toString()
              );
            }
            this.securityService.updateToken(curentUser);
            this.toaster.success('User Verified Successfully.');
          } else {
            this.toaster.warning('This User is not verified.');
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }

  openModalityCofiguration() {
    if (this.patientId) {
      this.router.navigateByUrl(`rpm/modalityConfiguration/${this.patientId}`);
    }
  }
  openModalityCofigurationMOdal() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.OpenModalityConfig;
    event.value = '3';
    this.eventBus.emit(event);
  }
  // getDevicesByPatientId() {
  //   if (this.patientId) {
  //     this.isLoading = true;
  //     this.rpmService.getDevicesByPatientId(this.patientId).subscribe(
  //       res => {
  //         this.isLoading = false;
  //         this.devicesList = res;
  //         this.getDeviceDisplayData();
  //         // console.log(this.devicesList);
  //         if (this.devicesList) {
  //           this.devicesList.forEach((device: PatientHealthCareDeviceForListDto) => {
  //             if (device.modalityCode) {
  //               if (device.modalityCode === 'BP') {
  //                 device.deviceName = 'Blood Pressure';
  //               }
  //               if (device.modalityCode === 'WT') {
  //                 device.deviceName = 'Weight';
  //               }
  //               if (device.modalityCode === 'PO') {
  //                 device.deviceName = 'Pulse Oximetry';
  //               }
  //               if (device.modalityCode === 'BG') {
  //                 device.deviceName = 'Blood Glucose';
  //               }
  //               if (device.modalityCode === 'AT') {
  //                 device.deviceName = 'Activity';
  //               }
  //             }
  //           });
  //         }
  //       },
  //       (error: HttpResError) => {
  //         this.isLoading = false;
  //         this.toaster.error(error.message, error.error);
  //       }
  //     );
  //   }
  // }

  getRpmEncounterTime1() {
    const monthId = new Date().getMonth() + 1;
    this.ccmService
      .GetRpmEncountersDurationByPatientId(this.patientId, this.rpmMonthId, this.yearNum)
      .subscribe(
        (res: any) => {
          if (res.duration) {
            this.rpmEncounterTime1.duration = res.duration;
            this.rpmEncounterTime1['durationInNumber'] = moment.duration(this.rpmEncounterTime1.duration).asMinutes();
          } else {
            this.rpmEncounterTime1.duration = '00:00:00';
            this.rpmEncounterTime1['durationInNumber'] = 0;
          }
          // this.toaster.success('Data Updated Successfully');
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );

      this.patientRPMCompRef?.getRpmEncounterTime();
  }


  openDeleteEncounterConfirmModal(data: RPMEncounterDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Alert';
    modalDto.Text = 'Do you want to delete this encounter ?';
    // modalDto.hideProceed = true;
    modalDto.callBack = this.deleteRpmEncounter;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  deleteRpmEncounter = (data: RPMEncounterDto) => {
    this.isEncounterDeleting = true;
      this.rpmService
        .DeleteRpmEncounter(data.id)
        .subscribe(
          res => {
            // this.getLogsByPatientAndMonthId();
            this.rpmEncounterList = this.rpmEncounterList.filter(x => x.id !== data.id);
            this.toaster.success('Encounter deleted successfully');
            this.getRpmEncounterTime1();
            if (this.rpmEncounterDto && this.rpmEncounterDto.id && data.id === this.rpmEncounterDto.id) {
              this.AddNew();
            }
          },
          (error: HttpResError) => {
            this.isEncounterDeleting = false;
            this.toaster.error(error.message, error.error);
          }
        );
  }


  getPatientDetail() {
    if (this.patientId) {
      this.patientsService
        .getPatientDetail(this.patientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.patientData = res;
              this.PatientEncounterMonthlyStatusTExt =
                this.rpmMonthlyStatusEnum[this.patientData.ccmMonthlyStatus];
            }
          },
          error => {
            //  console.log(error);
          }
        );
    }
  }
  verifyPhoneNumber() {
    this.verifyingPhone = true;
    this.verifyPhoneNoDto.userName = this.sendPhoneNoVerifictionDto.userName;
    this.securityService.VerifyPhoneNumber(this.verifyPhoneNoDto).subscribe(
      (res: any) => {
        this.verifyingPhone = false;
        this.verificationModal.hide();
        // this.loadFacilityUsers();
        this.patientData.phoneNumberConfirmed = true;
        this.toaster.success('Phone No Verified successfully');
        this.sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
        this.verifyPhoneNoDto = new VerifyPhoneNumberDto();
      },
      (err) => {
        this.verifyingPhone = false;
        this.toaster.error(err.error);
      }
    );
  }
  openVerificationModal() {
    this.verificationModal.show();
    this.verificationUserName = this.patientData.fullName;
    this.sendPhoneNoVerifictionDto.phoneNumber = this.patientData.homePhone;
    this.sendPhoneNoVerifictionDto.userName = this.patientData.userName;
    this.sendPhoneNoVerifictionDto.countryCallingCode = this.patientData.countryCallingCode;
  }
  sendPhoneNoVerificationToken() {
    this.sendingCode = true;
    this.securityService
      .SendPhoneNoVerificationToken(this.sendPhoneNoVerifictionDto)
      .subscribe(
        (res: any) => {
          this.sendingCode = false;
          // this.loadFacilityUsers();
          this.toaster.success('Verification code sent');
        },
        (err) => {
          this.sendingCode = false;
          this.toaster.error(err.error);
        }
      );
  }
  UpdatePhoneNo() {
    this.updatingPhoneNo = true;
    let data={
      countryCallingCode: this.patientData.countryCallingCode,
      userId: this.patientData.userId,
      phoneNumber: this.newPhoneNo
    }
    this.securityService
      .SetPhoneNumber(data)
      .subscribe(
        (res: any) => {
          this.verificationModalViewState = 0;
          this.sendPhoneNoVerifictionDto.phoneNumber = this.newPhoneNo;
          this.updatingPhoneNo = false;
          // this.loadFacilityUsers();
          this.toaster.success('Phone no saved successfully');
        },
        (err) => {
          this.updatingPhoneNo = false;
          this.toaster.error(err.error);
        }
      );
  }

  OpenVerifyProviderModal() {
    const modalData = new VerifyModalDto();
    modalData.Title = 'Change Provider';
    modalData.callBack = this.callback;
    modalData.data = {};
    this.appUi.openVerifyProviderMOdal(modalData);
    // this.appUi.showVerifyProviderModalSubject.next(modalData);
  }
  callback = (data: number, name: string) => {
    if (data) {
      this.rpmEncounterDto.billingProviderId = data;
      this.providerName = name ? name : '';
      this.toaster.success('Provider changed');
    } else {
      // this.isBillingProvider = false;
    this.toaster.error('Password is incorrect');
    }

  }
  clearDisableFields(){
    this.disableDay = null;
    this.disableMonth = null;
    this.disableYear = null;
  }
  openReadingDateCalender(bpItem){
    this.clearDisableFields();
    this.selectedBpItem = bpItem;
    console.log(bpItem);
    const mTime = bpItem.measurementDate;
    const mTimeNew = moment(mTime, 'D MMM YY,\\ h:mm a').format('YYYY-MM-DD');
    this.selectedDate = mTimeNew;
    const currentDate = new Date();
    const currentDateFormated = moment(currentDate).format('YYYY-MM-DD')
    const day =  +moment(currentDateFormated).format('D');
    const month = +moment(currentDateFormated).format('M');
    const year = +moment(currentDateFormated).format('YYYY');
    if(day < 5){
    this.disableDay = 31;
    this.disableMonth = month - 2;
    this.disableYear = year;
    }else{
    this.disableDay = 31;
    this.disableMonth = month - 1;
    this.disableYear = year;
    }
    this.myDatePickerOptions.disableDateRanges= [{begin: {year:1900, month:1, day:1}, end: {year:this.disableYear, month:this.disableMonth, day:this.disableDay}}];
    this.myDatePickerOptions = { ...this.myDatePickerOptions };
      this.datePicker.openBtnClicked();
  }
  editRpmReading(event){
    // const newDate =  moment(event.actualDateFormatted).format();
    this.editRpmReadingDto.measurementDate = event.actualDateFormatted;
    this.editRpmReadingDto.readingId = this.selectedBpItem.id;
    this.editRpmReadingDto.patientId = this.selectedBpItem.patientId;
    // this.editRpmReadingDto.modality = this.selectedModalityCode;
    this.rpmService.editRpmReadings(this.editRpmReadingDto).subscribe(
      (res: any) => {
        // this.getDeviceDisplayData();
        this.toaster.success('RPM Reading Updated');
      }, (err : HttpResError) => {
        this.toaster.error(err.error);
      }
    )
  }
  triggerPopOverCheck(eData: any) {
    setTimeout(() => {
      this.triggerPopOverCheckDElayed(eData);
    }, 500);
  }
  triggerPopOverCheckDElayed(eData: any) {
    const event = eData.event as KeyboardEvent;
    const editor = eData.editor;
    const eWIndow = editor.contentWindow as Window;
    const eDocumnet = eWIndow.document as Document;
    const activatedElement = eDocumnet.activeElement;
    const wSelection = eWIndow.getSelection() as Selection;
    const typedNode = wSelection.anchorNode;
    const typedElement = typedNode.parentElement;
    const cursorDetail = wSelection.getRangeAt(0).getBoundingClientRect();
    // const cursorDetail = window.getSelection().getRangeAt(0).getBoundingClientRect();
    const editorElement = document.getElementById('editorElement');
    if (!this.editorClickListener) {
      eWIndow.addEventListener('click', () => {
        this.ChangeIntellisenseViewState('none');
      });
      document.addEventListener('keydown', (eDetail) => {
        if (eDetail.key === 'Escape' || eDetail.key === 'Esc') {
          this.intellisensePreserveDetails.editor.focus();
          this.intellisensePreserveDetails.editor.selection.select(this.intellisensePreserveDetails.typedElement);
          this.intellisensePreserveDetails.editor.selection.collapse(0);
          this.ChangeIntellisenseViewState('none');
        }
      });
    }
    this.editorClickListener = true;
    const editorElementRect = editorElement.getBoundingClientRect();
    const rpmIntellisenseView = document.getElementById('rpmIntellisenseView');
    const rpmIntellisenseViewStyle = rpmIntellisenseView.style;
    rpmIntellisenseViewStyle.top = `${editorElementRect.y + cursorDetail.y + document.documentElement.scrollTop + 45}px`;
    // rpmIntellisenseViewStyle.left = `${editorElementRect.x + cursorDetail.x + 10}px`;
    rpmIntellisenseViewStyle.transform = `translate(${editorElementRect.x + cursorDetail.x + 10}px , 0px)`;
    const newText = typedElement.innerText;
    this.intellisensePreserveDetails = {
      typedElement: typedElement,
      wSelection: wSelection,
      editor: editor
    };
    const lastTwoAreDots = newText[wSelection.anchorOffset - 1] === '.' && newText[wSelection.anchorOffset - 2] === '.';
    let previousThirdIndexIsDot = false;
    if (wSelection.anchorOffset > 2) {
      previousThirdIndexIsDot = lastTwoAreDots && newText[wSelection.anchorOffset - 3] === '.';
    }
    if (wSelection.anchorOffset > 1 && lastTwoAreDots && !previousThirdIndexIsDot) {
      this.ChangeIntellisenseViewState('block');
    } else {
      this.ChangeIntellisenseViewState('none');
    }
  }
  ChangeIntellisenseViewState(viewState: string) {
    const rpmIntellisenseViewStyle = document.getElementById('rpmIntellisenseView')?.style;
    rpmIntellisenseViewStyle.display = viewState;
    if (viewState === 'none') {
      this.SelectedSmartPhrase = new SmartPhraseListDto();
    }
    if (viewState === 'block') {
      const selectForIntellisense = document.getElementById('selectForIntellisense');
      const inputEle = selectForIntellisense.getElementsByTagName('input') as any;
      if (inputEle && inputEle.length) {
        inputEle[0].focus();
      }
    }
  }
  GetSmartPhrases() {
    this.gettingPhrases = true;
    this.intellisenseService.GetSmartPhrases(this.securityService.securityObject.id).subscribe(
      (res: SmartPhraseListDto[]) => {
        this.gettingPhrases = false;
        this.smartPhrasesList = res.sort((a,b) => 0 - (a.title > b.title ? -1 : 1));
      },
      (error: HttpResError) => {
        this.gettingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SmartPhraseSelected() {
    this.usingSMartPhrase = true;
    this.intellisenseService.UseSmartPhrase(this.securityService.securityObject.id, this.SelectedSmartPhrase.id , this.patientId).subscribe(
      (res: any) => {
        this.usingSMartPhrase = false;
        this.AppendTextTOEditor(res.phraseText);
        // this.smartVariablesList = res;
      },
      (error: HttpResError) => {
        this.usingSMartPhrase = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AppendTextTOEditor(replacement: string) {
    let previousText = this.intellisensePreserveDetails.typedElement.innerText;
    const wSelection = this.intellisensePreserveDetails.wSelection;
    previousText = previousText.substring(0, wSelection.anchorOffset - 1) + '' + previousText.substring((wSelection.anchorOffset - 1) + 1);
    const newText = previousText.substring(0, wSelection.anchorOffset - 2) + replacement + ' ' + previousText.substring((wSelection.anchorOffset - 2) + 1);
    this.intellisensePreserveDetails.typedElement.innerText = newText;
    this.ChangeIntellisenseViewState('none');
    this.intellisensePreserveDetails.editor.focus();
    this.intellisensePreserveDetails.editor.selection.select(this.intellisensePreserveDetails.typedElement);
    this.intellisensePreserveDetails.editor.selection.collapse(0);
    // this.intellisensePreserveDetails.typedElement.focus();

  }
  getRpmEncounterSum(){
    debugger
    console.log(this.rpmEncounterTime1)
    this.totalRpmDuration = this.rpmEncounterTime1.durationInNumber + +this.rpmEncounterDto.duration;
    this.showValidationAlertData = ` <div>

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
    </div>`
  }
  sumEncounterstime(): number{
    const editEncounterId = this.rpmEncounterDto.id;
    let totalTime = 0;
    this.rpmEncounterList.forEach((item) => {
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
  // mahmood

  scrollLeft() {
    this.listItems.nativeElement.firstChild.scrollLeft -= 150;
  }

  scrollRight() {
    this.listItems.nativeElement.firstChild.scrollLeft += 150;
  }
  copyRpmNotesToEncounterNotes(){
    this.rpmEncounterDto.note = this.rpmNotes
    this.FillNoteText(this.rpmNotes)
  }
}
function convertHourstoMinute(duration: string) {
  throw new Error('Function not implemented.');
}
